import { Box } from '@mui/material';

export default function Logo({ sx }) {
  return <Box component="img" src="/logo.png" sx={{ width: 240, height: 62.4, ...sx }} />;
}