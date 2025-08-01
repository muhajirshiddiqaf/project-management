const Joi = require('joi');

const createCompanyConfiguration = Joi.object({
  company_name: Joi.string().max(255).required(),
  address: Joi.string().optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
  email: Joi.string().email().max(255).optional(),
  phone: Joi.string().max(50).optional(),
  website: Joi.string().uri().max(255).optional(),
  tax_number: Joi.string().max(100).optional(),
  logo_url: Joi.string().uri().optional()
});

const updateCompanyConfiguration = Joi.object({
  company_name: Joi.string().max(255).optional(),
  address: Joi.string().optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
  email: Joi.string().email().max(255).optional(),
  phone: Joi.string().max(50).optional(),
  website: Joi.string().uri().max(255).optional(),
  tax_number: Joi.string().max(100).optional(),
  logo_url: Joi.string().uri().optional()
});

module.exports = {
  createCompanyConfiguration,
  updateCompanyConfiguration
};
