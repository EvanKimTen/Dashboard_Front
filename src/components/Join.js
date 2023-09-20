import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

// TODO remove, this demo shouldn't need to reset the theme.

const proxy = axios.create({
  baseURL: "http://localhost:5001"
})
const defaultTheme = createTheme();

export default function Join() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [APIKey, setApiKey] = useState('');
  const [projectID, setProjectID] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await proxy.post("/join", {
      username,
      password,
      APIKey,
      projectID,
    });
    console.log(response.data);
    navigate('/');
  };

  return (
    <ThemeProvider theme={defaultTheme}> 
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  onChange={(e)=>setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="New Password"
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="API_KEY"
                  label="API KEY"
                  name="API_KEY"
                  autoComplete="API_KEY"
                  onChange={(e)=>setApiKey(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="projectID"
                  label="Project ID"
                  id="projectID"
                  autoComplete="Project ID"
                  onChange={(e)=>setProjectID(e.target.value)}
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./SignIn.js" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}