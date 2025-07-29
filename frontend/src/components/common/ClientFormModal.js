import PropTypes from 'prop-types';

// material-ui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    Stack,
    TextField
} from '@mui/material';

// third-party
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// assets
import {
    BankOutlined,
    FileTextOutlined,
    GlobalOutlined,
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined
} from '@ant-design/icons';

// ==============================|| CLIENT FORM MODAL ||============================== //

const ClientFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  title = "Add New Client",
  submitText = "Add Client",
  loading = false
}) => {
  console.log('ClientFormModal render:', { open, initialValues, title });

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
    company_name: Yup.string(),
    website: Yup.string().url('Invalid URL format'),
    notes: Yup.string()
  });

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    company_name: '',
    website: '',
    notes: ''
  };

  const formValues = initialValues || defaultValues;
  console.log('Form values to use:', formValues);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onSubmit(values);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, resetForm }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2} alignItems="center">
                {/* Name Field */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">Name *</InputLabel>
                    <TextField
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      placeholder="Enter client name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error>{errors.name}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Email Field */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email">Email *</InputLabel>
                    <TextField
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      placeholder="Enter email address"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error>{errors.email}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Phone Field */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="phone">Phone *</InputLabel>
                    <TextField
                      id="phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      placeholder="Enter phone number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText error>{errors.phone}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Company Field */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="company_name">Company</InputLabel>
                    <TextField
                      id="company_name"
                      name="company_name"
                      value={values.company_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter company name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BankOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                {/* Website Field */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="website">Website</InputLabel>
                    <TextField
                      id="website"
                      name="website"
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.website && Boolean(errors.website)}
                      placeholder="Enter website URL"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GlobalOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                    {touched.website && errors.website && (
                      <FormHelperText error>{errors.website}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Address Field */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="address">Address *</InputLabel>
                    <TextField
                      id="address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      placeholder="Enter address"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                    {touched.address && errors.address && (
                      <FormHelperText error>{errors.address}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Notes Field */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="notes">Notes</InputLabel>
                    <TextField
                      id="notes"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter additional notes"
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FileTextOutlined />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Saving...' : submitText}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

ClientFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  title: PropTypes.string,
  submitText: PropTypes.string,
  loading: PropTypes.bool
};

export default ClientFormModal;
