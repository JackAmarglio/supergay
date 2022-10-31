import Head from 'next/head';
import {
    Stack,
    Typography,
    Button,
    TextField,
    Card,
    CircularProgress
} from '@mui/material';
import { useAuth } from 'contexts/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Login = () => {
    const { isAuthenticated, loading, login } = useAuth();
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
          username: '',
          password: ''
        },
        validationSchema: Yup.object({
          username: Yup
            .string()
            .max(16)
            .required(
              'Username is required'),
          password: Yup
            .string()
            .max(32)
            .required(
              'Password is required')
        }),
        onSubmit: (values, helpers) => {
          const loginOn = async () => {
            try {
              const lr = await login(values.username, values.password);
              if(lr.status == false)
                throw new Error(lr.message);
              window.location.pathname = '/acp/data';
              toast.success(lr.message);
            } catch(err) {
              toast.error(err.message);
              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: err.message });
              helpers.setSubmitting(false);
            }
          }
          loginOn();
        }
    });
    useEffect(() => {
        if (!loading && isAuthenticated) {
          router.push('/acp/data');
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, loading]);
    if(loading || (isAuthenticated && !loading)) {
        return (
            <>
                <Head>
                    <title>ETHTRADERS | Admin Panel</title>
                </Head>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        minHeight: '80vh'
                    }}
                >
                    <CircularProgress color="inherit" />
                </Stack>
            </>
        )
    }
    return (
    <>
        <Head>
            <title>ETHTRADERS | Admin Panel</title>
        </Head>
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                alignText: "center"
            }}
            spacing={1}
        >
            <Card
                sx={{
                    pt: 3,
                    pb: 3,
                    pr: 6,
                    pl: 6
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Stack
                        row="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            alignText: "center"
                        }}
                        spacing={1}
                    >
                        <Typography 
                            color="textPrimary"
                            variant="h3"
                        >
                            Sign-in to admin panel
                        </Typography>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            Note that this is merely for monitoring purposes
                        </Typography>
                        <TextField 
                            variant="outlined"
                            label="Username"
                            type="name"
                            name="username"
                            sx={{
                                width: 300
                            }}
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                        <TextField 
                            variant="outlined"
                            label="Password"
                            type="password"
                            sx={{
                                width: 300
                            }}
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                width: 300
                            }}
                        >
                            Login
                        </Button>
                    </Stack>
                </form>
            </Card>
        </Stack>
    </>
    )
}

export default Login;