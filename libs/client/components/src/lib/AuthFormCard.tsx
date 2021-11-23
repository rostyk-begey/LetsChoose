import React, { ReactNode } from 'react';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

export interface AuthFormCardProps {
  title: string;
  submitButtonText: string;
  onSubmit: () => void;
  submitDisabled?: boolean;
  cardAfter: ReactNode;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({
  title,
  submitButtonText,
  onSubmit,
  submitDisabled,
  cardAfter,
  children,
}) => (
  <Card
    component="form"
    onSubmit={onSubmit}
    variant="outlined"
    sx={{
      width: '100%',
      maxWidth: 400,
    }}
  >
    <CardHeader title={<Typography variant="h6">{title}</Typography>} />
    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
      {children}
      <Box my={2} display="flex" justifyContent="stretch">
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={submitDisabled}
          sx={{ width: '100%', textTransform: 'none' }}
        >
          {submitButtonText}
        </Button>
      </Box>
      {cardAfter}
    </CardContent>
  </Card>
);
