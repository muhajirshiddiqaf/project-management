const Boom = require('@hapi/boom');
const puppeteer = require('puppeteer');
const { PDFDocument, PDFSignature } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFHandler {
  constructor() {
    this.pdfRepository = null;
    this.browser = null;
  }

  // Set repository (dependency injection)
  setPDFRepository(pdfRepository) {
    this.pdfRepository = pdfRepository;
  }

  // Initialize browser for PDF generation
  async initializeBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  // === PDF GENERATION METHODS ===
  async generatePDF(request, h) {
    try {
      const { template_id, template_name, content, options = {} } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      let template = null;

      // Get template if template_id is provided
      if (template_id) {
        template = await this.pdfRepository.getPDFTemplateById(template_id, organizationId);
        if (!template) {
          throw Boom.notFound('PDF template not found');
        }
      } else if (template_name) {
        // Get template by name
        template = await this.pdfRepository.getPDFTemplateByName(template_name, organizationId);
        if (!template) {
          throw Boom.notFound('PDF template not found');
        }
      }

      // Generate PDF content
      const pdfContent = await this.generatePDFContent(template, content, options);

      // Apply compression if enabled
      let finalPDF = pdfContent;
      if (options.compression !== false) {
        finalPDF = await this.compressPDF(pdfContent, options.compression_quality || 'medium');
      }

      // Apply digital signature if enabled
      if (options.digital_signature && options.digital_signature.enabled) {
        finalPDF = await this.signPDF(finalPDF, options.digital_signature);
      }

      // Store PDF record
      const pdfRecord = await this.pdfRepository.createPDFRecord({
        organization_id: organizationId,
        template_id: template ? template.id : null,
        content: content,
        options: options,
        file_size: Buffer.byteLength(finalPDF, 'base64'),
        generated_by: request.auth.credentials.user_id
      });

      return h.response({
        success: true,
        message: 'PDF generated successfully',
        data: {
          pdf_id: pdfRecord.id,
          pdf_data: finalPDF,
          file_size: Buffer.byteLength(finalPDF, 'base64'),
          template_used: template ? template.name : 'Custom'
        }
      }).code(200);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw Boom.internal('Failed to generate PDF');
    }
  }

  async generateQuotationPDF(request, h) {
    try {
      const { quotation_id, template_id, include_signature, include_terms, include_company_logo, options = {} } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      // Get quotation data
      const quotation = await this.pdfRepository.getQuotationById(quotation_id, organizationId);
      if (!quotation) {
        throw Boom.notFound('Quotation not found');
      }

      // Get template
      let template = null;
      if (template_id) {
        template = await this.pdfRepository.getPDFTemplateById(template_id, organizationId);
        if (!template) {
          throw Boom.notFound('PDF template not found');
        }
      } else {
        // Get default quotation template
        template = await this.pdfRepository.getDefaultPDFTemplate('quotation', organizationId);
      }

      // Prepare content for quotation PDF
      const content = await this.prepareQuotationContent(quotation, include_signature, include_terms, include_company_logo);

      // Generate PDF
      const pdfContent = await this.generatePDFContent(template, content, options);

      // Apply compression if enabled
      let finalPDF = pdfContent;
      if (options.compression !== false) {
        finalPDF = await this.compressPDF(pdfContent, options.compression_quality || 'medium');
      }

      // Apply digital signature if enabled
      if (options.digital_signature && options.digital_signature.enabled) {
        finalPDF = await this.signPDF(finalPDF, options.digital_signature);
      }

      // Store PDF record
      const pdfRecord = await this.pdfRepository.createPDFRecord({
        organization_id: organizationId,
        template_id: template ? template.id : null,
        quotation_id: quotation_id,
        content: content,
        options: options,
        file_size: Buffer.byteLength(finalPDF, 'base64'),
        generated_by: request.auth.credentials.user_id
      });

      return h.response({
        success: true,
        message: 'Quotation PDF generated successfully',
        data: {
          pdf_id: pdfRecord.id,
          pdf_data: finalPDF,
          file_size: Buffer.byteLength(finalPDF, 'base64'),
          quotation_number: quotation.quotation_number
        }
      }).code(200);
    } catch (error) {
      console.error('Error generating quotation PDF:', error);
      throw Boom.internal('Failed to generate quotation PDF');
    }
  }

  async generateInvoicePDF(request, h) {
    try {
      const { invoice_id, template_id, include_payment_terms, include_company_logo, options = {} } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      // Get invoice data
      const invoice = await this.pdfRepository.getInvoiceById(invoice_id, organizationId);
      if (!invoice) {
        throw Boom.notFound('Invoice not found');
      }

      // Get template
      let template = null;
      if (template_id) {
        template = await this.pdfRepository.getPDFTemplateById(template_id, organizationId);
        if (!template) {
          throw Boom.notFound('PDF template not found');
        }
      } else {
        // Get default invoice template
        template = await this.pdfRepository.getDefaultPDFTemplate('invoice', organizationId);
      }

      // Prepare content for invoice PDF
      const content = await this.prepareInvoiceContent(invoice, include_payment_terms, include_company_logo);

      // Generate PDF
      const pdfContent = await this.generatePDFContent(template, content, options);

      // Apply compression if enabled
      let finalPDF = pdfContent;
      if (options.compression !== false) {
        finalPDF = await this.compressPDF(pdfContent, options.compression_quality || 'medium');
      }

      // Apply digital signature if enabled
      if (options.digital_signature && options.digital_signature.enabled) {
        finalPDF = await this.signPDF(finalPDF, options.digital_signature);
      }

      // Store PDF record
      const pdfRecord = await this.pdfRepository.createPDFRecord({
        organization_id: organizationId,
        template_id: template ? template.id : null,
        invoice_id: invoice_id,
        content: content,
        options: options,
        file_size: Buffer.byteLength(finalPDF, 'base64'),
        generated_by: request.auth.credentials.user_id
      });

      return h.response({
        success: true,
        message: 'Invoice PDF generated successfully',
        data: {
          pdf_id: pdfRecord.id,
          pdf_data: finalPDF,
          file_size: Buffer.byteLength(finalPDF, 'base64'),
          invoice_number: invoice.invoice_number
        }
      }).code(200);
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw Boom.internal('Failed to generate invoice PDF');
    }
  }

  // === PDF TEMPLATES METHODS ===
  async getPDFTemplates(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', category, is_active } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { category, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const templates = await this.pdfRepository.getPDFTemplates(organizationId, filters, pagination);
      const total = await this.pdfRepository.countPDFTemplates(organizationId, filters);

      return h.response({
        success: true,
        data: templates,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting PDF templates:', error);
      throw Boom.internal('Failed to get PDF templates');
    }
  }

  async getPDFTemplateById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this.pdfRepository.getPDFTemplateById(id, organizationId);
      if (!template) {
        throw Boom.notFound('PDF template not found');
      }

      return h.response({
        success: true,
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting PDF template:', error);
      throw Boom.internal('Failed to get PDF template');
    }
  }

  async createPDFTemplate(request, h) {
    try {
      const templateData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const template = await this.pdfRepository.createPDFTemplate(templateData);

      return h.response({
        success: true,
        message: 'PDF template created successfully',
        data: template
      }).code(201);
    } catch (error) {
      console.error('Error creating PDF template:', error);
      throw Boom.internal('Failed to create PDF template');
    }
  }

  async updatePDFTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const template = await this.pdfRepository.updatePDFTemplate(id, organizationId, updateData);
      if (!template) {
        throw Boom.notFound('PDF template not found');
      }

      return h.response({
        success: true,
        message: 'PDF template updated successfully',
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating PDF template:', error);
      throw Boom.internal('Failed to update PDF template');
    }
  }

  async deletePDFTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this.pdfRepository.deletePDFTemplate(id, organizationId);
      if (!template) {
        throw Boom.notFound('PDF template not found');
      }

      return h.response({
        success: true,
        message: 'PDF template deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting PDF template:', error);
      throw Boom.internal('Failed to delete PDF template');
    }
  }

  // === PDF COMPRESSION METHODS ===
  async compressPDF(request, h) {
    try {
      const { pdf_data, quality = 'medium', max_size_mb, remove_metadata } = request.payload;

      const compressedPDF = await this.compressPDFData(pdf_data, quality, max_size_mb, remove_metadata);

      return h.response({
        success: true,
        message: 'PDF compressed successfully',
        data: {
          original_size: Buffer.byteLength(pdf_data, 'base64'),
          compressed_size: Buffer.byteLength(compressedPDF, 'base64'),
          compression_ratio: ((Buffer.byteLength(pdf_data, 'base64') - Buffer.byteLength(compressedPDF, 'base64')) / Buffer.byteLength(pdf_data, 'base64') * 100).toFixed(2),
          pdf_data: compressedPDF
        }
      }).code(200);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      throw Boom.internal('Failed to compress PDF');
    }
  }

  // === PDF DIGITAL SIGNATURE METHODS ===
  async signPDF(request, h) {
    try {
      const { pdf_data, certificate_path, password, reason, location, signature_position } = request.payload;

      const signedPDF = await this.signPDFData(pdf_data, certificate_path, password, reason, location, signature_position);

      return h.response({
        success: true,
        message: 'PDF signed successfully',
        data: {
          pdf_data: signedPDF,
          signature_info: {
            reason: reason || 'Document signing',
            location: location || 'Digital signature',
            timestamp: new Date().toISOString()
          }
        }
      }).code(200);
    } catch (error) {
      console.error('Error signing PDF:', error);
      throw Boom.internal('Failed to sign PDF');
    }
  }

  async verifyPDFSignature(request, h) {
    try {
      const { pdf_data } = request.payload;

      const verificationResult = await this.verifyPDFSignatureData(pdf_data);

      return h.response({
        success: true,
        message: 'PDF signature verification completed',
        data: verificationResult
      }).code(200);
    } catch (error) {
      console.error('Error verifying PDF signature:', error);
      throw Boom.internal('Failed to verify PDF signature');
    }
  }

  // === PDF MERGE METHODS ===
  async mergePDFs(request, h) {
    try {
      const { pdfs, output_name, options = {} } = request.payload;

      const mergedPDF = await this.mergePDFData(pdfs, output_name, options);

      return h.response({
        success: true,
        message: 'PDFs merged successfully',
        data: {
          pdf_data: mergedPDF,
          file_size: Buffer.byteLength(mergedPDF, 'base64'),
          pages_merged: pdfs.length
        }
      }).code(200);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      throw Boom.internal('Failed to merge PDFs');
    }
  }

  // === PDF STATISTICS METHODS ===
  async getPDFStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month', category, start_date, end_date } = request.query;

      const statistics = await this.pdfRepository.getPDFStatistics(organizationId, { period, category, start_date, end_date });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting PDF statistics:', error);
      throw Boom.internal('Failed to get PDF statistics');
    }
  }

  async getPDFTemplateStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month', start_date, end_date } = request.query;

      const statistics = await this.pdfRepository.getPDFTemplateStatistics(organizationId, { period, start_date, end_date });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting PDF template statistics:', error);
      throw Boom.internal('Failed to get PDF template statistics');
    }
  }

  // === HELPER METHODS ===
  async generatePDFContent(template, content, options) {
    await this.initializeBrowser();

    let htmlContent = '';
    let cssContent = '';

    if (template) {
      htmlContent = this.mergeTemplate(template.html_content, content);
      cssContent = template.css_content || '';
    } else {
      // Generate basic HTML from content
      htmlContent = this.generateBasicHTML(content);
    }

    // Apply options
    const finalHTML = this.applyPDFOptions(htmlContent, cssContent, options);

    const page = await this.browser.newPage();
    await page.setContent(finalHTML, { waitUntil: 'networkidle0' });

    const pdfOptions = {
      format: options.format || 'A4',
      printBackground: true,
      margin: {
        top: options.margin?.top || '20px',
        bottom: options.margin?.bottom || '20px',
        left: options.margin?.left || '20px',
        right: options.margin?.right || '20px'
      }
    };

    const pdfBuffer = await page.pdf(pdfOptions);
    await page.close();

    return pdfBuffer.toString('base64');
  }

  async compressPDF(pdfData, quality = 'medium') {
    const pdfDoc = await PDFDocument.load(Buffer.from(pdfData, 'base64'));

    // Apply compression based on quality
    const compressionLevel = quality === 'high' ? 0.9 : quality === 'low' ? 0.5 : 0.7;

    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 20,
      updateFieldAppearances: false
    });

    return Buffer.from(compressedBytes).toString('base64');
  }

  async signPDF(pdfData, signatureOptions) {
    const pdfDoc = await PDFDocument.load(Buffer.from(pdfData, 'base64'));

    // Load certificate
    const certificateBytes = await fs.readFile(signatureOptions.certificate_path);

    // Create signature
    const signature = await PDFSignature.create(pdfDoc, certificateBytes, {
      reason: signatureOptions.reason || 'Document signing',
      location: signatureOptions.location || 'Digital signature',
      password: signatureOptions.password
    });

    const signedBytes = await pdfDoc.save();
    return Buffer.from(signedBytes).toString('base64');
  }

  async verifyPDFSignatureData(pdfData) {
    const pdfDoc = await PDFDocument.load(Buffer.from(pdfData, 'base64'));

    // Check if PDF has signatures
    const signatures = pdfDoc.getSignatures();

    if (signatures.length === 0) {
      return {
        has_signatures: false,
        message: 'No signatures found in PDF'
      };
    }

    const verificationResults = [];
    for (const signature of signatures) {
      try {
        const isValid = await signature.verify();
        verificationResults.push({
          signature_id: signature.getId(),
          is_valid: isValid,
          reason: signature.getReason(),
          location: signature.getLocation(),
          timestamp: signature.getTime()
        });
      } catch (error) {
        verificationResults.push({
          signature_id: signature.getId(),
          is_valid: false,
          error: error.message
        });
      }
    }

    return {
      has_signatures: true,
      total_signatures: signatures.length,
      valid_signatures: verificationResults.filter(r => r.is_valid).length,
      signatures: verificationResults
    };
  }

  async mergePDFData(pdfs, outputName, options) {
    const mergedPdf = await PDFDocument.create();

    for (const pdf of pdfs) {
      const pdfDoc = await PDFDocument.load(Buffer.from(pdf.data, 'base64'));
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save({
      useObjectStreams: options.compression !== false,
      addDefaultPage: false
    });

    return Buffer.from(mergedBytes).toString('base64');
  }

  async prepareQuotationContent(quotation, includeSignature, includeTerms, includeCompanyLogo) {
    // Prepare quotation-specific content
    const content = {
      quotation_number: quotation.quotation_number,
      client_name: quotation.client_name,
      client_email: quotation.client_email,
      total_amount: quotation.total_amount,
      currency: quotation.currency,
      valid_until: quotation.valid_until,
      items: quotation.items || [],
      terms: includeTerms ? quotation.terms : null,
      company_logo: includeCompanyLogo ? quotation.company_logo : null,
      signature: includeSignature ? quotation.signature : null
    };

    return content;
  }

  async prepareInvoiceContent(invoice, includePaymentTerms, includeCompanyLogo) {
    // Prepare invoice-specific content
    const content = {
      invoice_number: invoice.invoice_number,
      client_name: invoice.client_name,
      client_email: invoice.client_email,
      total_amount: invoice.total_amount,
      currency: invoice.currency,
      due_date: invoice.due_date,
      items: invoice.items || [],
      payment_terms: includePaymentTerms ? invoice.payment_terms : null,
      company_logo: includeCompanyLogo ? invoice.company_logo : null
    };

    return content;
  }

  mergeTemplate(template, data) {
    let merged = template;

    // Replace variables in template with data
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      merged = merged.replace(regex, data[key]);
    });

    return merged;
  }

  generateBasicHTML(content) {
    // Generate basic HTML structure from content
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Generated Document</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .content { margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="content">
          ${JSON.stringify(content, null, 2)}
        </div>
      </body>
      </html>
    `;
  }

  applyPDFOptions(htmlContent, cssContent, options) {
    let finalHTML = htmlContent;

    // Add header if enabled
    if (options.header && options.header.enabled) {
      const headerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; height: ${options.header.height || 50}px; background: #f0f0f0; padding: 10px; text-align: center;">
          ${options.header.content || ''}
        </div>
      `;
      finalHTML = finalHTML.replace('<body>', `<body>${headerHTML}`);
    }

    // Add footer if enabled
    if (options.footer && options.footer.enabled) {
      const footerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; height: ${options.footer.height || 50}px; background: #f0f0f0; padding: 10px; text-align: center;">
          ${options.footer.content || ''}
        </div>
      `;
      finalHTML = finalHTML.replace('</body>', `${footerHTML}</body>`);
    }

    // Add watermark if enabled
    if (options.watermark && options.watermark.enabled) {
      const watermarkCSS = `
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 48px;
          color: rgba(0,0,0,${options.watermark.opacity || 0.3});
          z-index: 1000;
          pointer-events: none;
        }
      `;
      const watermarkHTML = `<div class="watermark">${options.watermark.text || 'DRAFT'}</div>`;
      finalHTML = finalHTML.replace('</head>', `<style>${watermarkCSS}</style></head>`);
      finalHTML = finalHTML.replace('<body>', `<body>${watermarkHTML}`);
    }

    // Add custom CSS
    if (cssContent) {
      finalHTML = finalHTML.replace('</head>', `<style>${cssContent}</style></head>`);
    }

    return finalHTML;
  }
}

module.exports = new PDFHandler();
