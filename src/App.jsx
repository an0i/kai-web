import {
  Alert, Button, ButtonGroup, Container, Stack, TextField, Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import fetchClick from './utils/fetchClick';

export default function App() {
  const [idInputText, setIdInputText] = React.useState('');
  const [passwordInputText, setPasswordInputText] = React.useState('');
  const [textInputText, setTextInputText] = React.useState('');
  const [buttonDisabled, setButtonDisabled] = React.useState({
    create: false, save: false, pull: false, destroy: false,
  });

  const handleClick = React.useCallback((event) => {
    const todo = event.target.name;
    setButtonDisabled({ ...buttonDisabled, [todo]: true });
    function errorHandler(e) { enqueueSnackbar(e.message, { variant: 'error' }); }
    function fin() { setButtonDisabled({ ...buttonDisabled, [todo]: false }); }
    if (todo === 'create') {
      const payload = JSON.stringify({ password: passwordInputText, text: textInputText });
      fetchClick(todo, payload, (data) => { setIdInputText(data.id); }, errorHandler, fin);
    } else if (!idInputText) {
      enqueueSnackbar('未知的实例', { variant: 'error' });
      setButtonDisabled({ ...buttonDisabled, [todo]: false });
    } else if (!!idInputText && todo === 'save') {
      const payload = JSON.stringify({ id: idInputText, password: passwordInputText, text: textInputText });
      fetchClick(todo, payload, () => {}, errorHandler, fin);
    } else if (!!idInputText && todo === 'pull') {
      const payload = JSON.stringify({ id: idInputText, password: passwordInputText });
      fetchClick(todo, payload, (data) => { setTextInputText(data.text); }, errorHandler, fin);
    } else if (!!idInputText && todo === 'destroy') {
      const payload = JSON.stringify({ id: idInputText, password: passwordInputText });
      fetchClick(todo, payload, () => { setIdInputText(''); setPasswordInputText(''); setTextInputText(''); }, errorHandler, fin);
    } else {
      setButtonDisabled({ ...buttonDisabled, [todo]: false });
    }
  }, [textInputText, idInputText, passwordInputText]);

  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5">
          传阅板
        </Typography>
        <Stack spacing={2} direction="row" sx={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
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
          <Button name="destroy" onClick={handleClick} disabled={buttonDisabled.destroy} variant="outlined" color="error">
            销毁
          </Button>
        </Stack>
        <Stack spacing={2} direction="row">
          <TextField autoComplete="off" value={idInputText} onChange={(e) => setIdInputText(e.target.value)} id="id" label="实例" variant="outlined" />
          <TextField fullWidth autoComplete="off" value={passwordInputText} onChange={(e) => setPasswordInputText(e.target.value)} id="pass" label="密码" variant="outlined" />
        </Stack>
        <TextField fullWidth multiline minRows={5} autoComplete="off" value={textInputText} onChange={(e) => setTextInputText(e.target.value)} id="text" label="文本" variant="outlined" />
        <Alert severity="info">密码仅在创建时指定，无保存或拉取操作10分钟自动销毁实例</Alert>
      </Stack>
    </Container>
  );
}
