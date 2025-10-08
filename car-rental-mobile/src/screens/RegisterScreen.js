import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  driversLicense: Yup.string().required(),
});

export default function RegisterScreen({ navigation }){
  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Create account</Text>
      <Formik initialValues={{name:'',email:'',password:'',driversLicense:''}} validationSchema={RegisterSchema}
        onSubmit={async (values,{setSubmitting})=>{
          try {
            await api.post('/customers', values);
            Alert.alert('Success', 'Account created — please sign in');
            navigation.navigate('Login');
          } catch(err){
            Alert.alert('Error', err.response?.data?.message || err.message);
          } finally { setSubmitting(false); }
        }}
      >
        {({handleChange,handleSubmit,values})=>(
          <>
            <TextInput className="border border-gray-300 p-3 rounded mb-3" placeholder="Full name" onChangeText={handleChange('name')} value={values.name} />
            <TextInput className="border border-gray-300 p-3 rounded mb-3" placeholder="Email" onChangeText={handleChange('email')} value={values.email} />
            <TextInput className="border border-gray-300 p-3 rounded mb-3" placeholder="Password" secureTextEntry onChangeText={handleChange('password')} value={values.password} />
            <TextInput className="border border-gray-300 p-3 rounded mb-3" placeholder="Driver's license" onChangeText={handleChange('driversLicense')} value={values.driversLicense} />
            <Button title="Register" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}
