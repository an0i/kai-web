import React from 'react';
import {
  Container, Typography, Stack, Button, TextField, ButtonGroup, Alert, CssBaseline,
} from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import post from './post';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode],
  );

  const [idInputText, setIdInputText] = React.useState('');
  const [passwordInputText, setPasswordInputText] = React.useState('');
  const [textInputText, setTextInputText] = React.useState('');
  const [buttonDisabled, setButtonDisabled] = React.useState({
    create: false, save: false, pull: false, destroy: false,
  });

  async function handleClick(e) {
    const action = e.target.name;
    if (action !== 'create' && !idInputText) {
      enqueueSnackbar('未知的实例', { variant: 'error' });
      return;
    }
    setButtonDisabled({ ...buttonDisabled, [action]: true });
    try {
      const result = await post(
        action,
        { text: textInputText, id: idInputText, password: passwordInputText },
      );
      if (action === 'create') {
        setIdInputText(result.id);
      } else if (action === 'pull') {
        setTextInputText(result.text);
      } else if (action === 'destroy') {
        setIdInputText('');
        setPasswordInputText('');
        setTextInputText('');
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setButtonDisabled({ ...buttonDisabled, [action]: false });
    }
  }

  function handleChange(e) {
    if (e.target.id === 'id') {
      setIdInputText(e.target.value);
    } else if (e.target.id === 'pass') {
      setPasswordInputText(e.target.value);
    } else if (e.target.id === 'text') {
      setTextInputText(e.target.value);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <SnackbarProvider maxSnack={5} autoHideDuration={2000}>
          <Stack spacing={2} py={2}>
            <Typography variant="h5">
              传阅板
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button name="create" onClick={handleClick} disabled={buttonDisabled.create} variant="outlined">
                创建
              </Button>
              <ButtonGroup>
                <Button name="save" onClick={handleClick} disabled={buttonDisabled.save} variant="outlined">
                  保存
                </Button>
                <Button name="pull" onClick={handleClick} disabled={buttonDisabled.pull} variant="outlined">
                  拉取
                </Button>
              </ButtonGroup>
              <Button sx={{ marginLeft: 'auto!important' }} name="destroy" onClick={handleClick} disabled={buttonDisabled.destroy} variant="outlined" color="error">
                销毁
              </Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField autoComplete="off" value={idInputText} onChange={handleChange} id="id" label="实例" variant="outlined" />
              <TextField autoComplete="off" fullWidth value={passwordInputText} onChange={handleChange} id="pass" label="密码" variant="outlined" />
            </Stack>
            <TextField multiline minRows={5} autoComplete="off" value={textInputText} onChange={handleChange} id="text" label="文本" variant="outlined" />
            <Alert severity="info">密码仅在创建时指定，无保存或拉取操作10分钟自动销毁实例</Alert>
            { import.meta.env.MODE === 'development' && <Alert severity="warning">{ `开发模式构建，POST地址: ${import.meta.env.VITE_API_URL}/instances/{action}` }</Alert> }
          </Stack>
        </SnackbarProvider>
      </Container>
    </ThemeProvider>
  );
}

export default App;
