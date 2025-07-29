import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';

// project imports
import authAPI from 'api/auth';
import MainCard from 'components/MainCard';
import { useAuth } from 'contexts/AuthContext';

// assets
import CancelOutlined from '@ant-design/icons/CancelOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// ==============================|| PROFILE PAGE ||============================== //

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleTogglePassword = (field) => {
    switch (field) {
      case 'password':
        setShowPassword(!showPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setPasswordMode(false);
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (response.data?.user) {
        updateUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password changed successfully!');
      setPasswordMode(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Change password error:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.firstName) {
      return user.firstName;
    }

    if (user.email) {
      return user.email.split('@')[0];
    }

    return 'User';
  };

  const getUserRole = () => {
    if (!user) return 'Guest';

    if (user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    return 'User';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="User Profile">
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Profile Header */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar
                    src={avatar1}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4">{getUserDisplayName()}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {getUserRole()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  {!editMode && !passwordMode && (
                    <Button
                      variant="outlined"
                      startIcon={<EditOutlined />}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Profile Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Personal Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={editMode ? formData.firstName : (user?.firstName || '')}
                          onChange={handleInputChange('firstName')}
                          disabled={!editMode}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={editMode ? formData.lastName : (user?.lastName || '')}
                          onChange={handleInputChange('lastName')}
                          disabled={!editMode}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={user?.email || ''}
                          disabled={true}
                          sx={{ mb: 2 }}
                          helperText="Email cannot be changed"
                        />
                      </Grid>
                    </Grid>

                    {editMode && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={loading ? <CircularProgress size={16} /> : <SaveOutlined />}
                          onClick={handleUpdateProfile}
                          disabled={loading}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelOutlined />}
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Change Password */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Change Password
                    </Typography>

                    {!passwordMode ? (
                      <Button
                        variant="outlined"
                        onClick={() => setPasswordMode(true)}
                      >
                        Change Password
                      </Button>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.currentPassword}
                            onChange={handleInputChange('currentPassword')}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => handleTogglePassword('password')}
                                    edge="end"
                                  >
                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleInputChange('newPassword')}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => handleTogglePassword('newPassword')}
                                    edge="end"
                                  >
                                    {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => handleTogglePassword('confirmPassword')}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              startIcon={loading ? <CircularProgress size={16} /> : <SaveOutlined />}
                              onClick={handleChangePassword}
                              disabled={loading}
                            >
                              Change Password
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<CancelOutlined />}
                              onClick={handleCancelEdit}
                              disabled={loading}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}
