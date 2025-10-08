import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center p-6 bg-white">
          <Text className="text-3xl font-bold text-center mb-2 text-gray-800">
            Welcome Back
          </Text>
          <Text className="text-base text-center mb-8 text-gray-600">
            Sign in to continue
          </Text>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              try {
                await login(values.email, values.password);
                // Navigation handled by AuthContext
              } catch (err) {
                // Handle different error types
                if (err.response?.status === 401) {
                  setFieldError('email', ' ');
                  setFieldError('password', 'Invalid email or password');
                } else if (err.response?.status === 422) {
                  // Handle validation errors from backend
                  const errors = err.response.data.errors;
                  Object.keys(errors).forEach(key => {
                    setFieldError(key, errors[key][0]);
                  });
                } else if (err.code === 'NETWORK_ERROR' || !err.response) {
                  Alert.alert(
                    'Connection Error',
                    'Please check your internet connection and try again.'
                  );
                } else {
                  Alert.alert(
                    'Error',
                    'Something went wrong. Please try again later.'
                  );
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ 
              handleChange, 
              handleBlur, 
              handleSubmit, 
              values, 
              errors, 
              touched, 
              isSubmitting 
            }) => (
              <>
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Email
                  </Text>
                  <TextInput
                    className={`border ${
                      errors.email && touched.email 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    } p-3 rounded-lg bg-gray-50`}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    accessible={true}
                    accessibilityLabel="Email address"
                    accessibilityHint="Enter your email address to sign in"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    editable={!isSubmitting}
                  />
                  {errors.email && touched.email && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Password
                  </Text>
                  <TextInput
                    className={`border ${
                      errors.password && touched.password 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    } p-3 rounded-lg bg-gray-50`}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    textContentType="password"
                    accessible={true}
                    accessibilityLabel="Password"
                    accessibilityHint="Enter your password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    editable={!isSubmitting}
                  />
                  {errors.password && touched.password && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  className={`${
                    isSubmitting 
                      ? 'bg-blue-400' 
                      : 'bg-blue-600 active:bg-blue-700'
                  } p-4 rounded-lg mb-4`}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Sign in button"
                  accessibilityState={{ disabled: isSubmitting }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-base">
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    // Navigate to forgot password screen
                    if (navigation) {
                      navigation.navigate('ForgotPassword');
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <Text className="text-blue-600 text-center mb-4">
                    Forgot your password?
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center">
                  <Text className="text-gray-600">
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // Navigate to signup screen
                      if (navigation) {
                        navigation.navigate('SignUp');
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    <Text className="text-blue-600 font-semibold">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}