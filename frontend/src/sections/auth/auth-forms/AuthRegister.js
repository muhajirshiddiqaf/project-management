import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import { useAuth } from 'contexts/AuthContext';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// ============================|| REGISTER ||============================ //

const AuthRegister = () => {
  const { register, error, clearError } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          companyName: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          companyName: Yup.string().max(255).required('Company Name is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            clearError();
            const result = await register(values);

            if (result.success) {
              setStatus({ success: true });
              setSubmitting(false);
              // Navigate to login after successful registration
              setTimeout(() => {
                navigate('/login');
              }, 100);
            } else {
              setStatus({ success: false });
              setErrors({ submit: result.error });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-register">First Name</InputLabel>
                  <OutlinedInput
                    id="firstname-register"
                    type="text"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="standard-weight-helper-text-firstname-register">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-register">Last Name</InputLabel>
                  <OutlinedInput
                    id="lastname-register"
                    type="text"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="standard-weight-helper-text-lastname-register">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-register">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-register"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-register">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-register">Company Name</InputLabel>
                  <OutlinedInput
                    id="company-register"
                    type="text"
                    value={values.companyName}
                    name="companyName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    fullWidth
                    error={Boolean(touched.companyName && errors.companyName)}
                  />
                  {touched.companyName && errors.companyName && (
                    <FormHelperText error id="standard-weight-helper-text-company-register">
                      {errors.companyName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-register"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-register">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Sign up
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="body2">Sign up with</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center" spacing={2}>
                  <Typography variant="subtitle1">Already have an account?</Typography>
                  <Link component={RouterLink} to="/login" variant="subtitle1">
                    Sign in
                  </Link>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
