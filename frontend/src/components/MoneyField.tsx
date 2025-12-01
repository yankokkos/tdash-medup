import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';

interface MoneyFieldProps {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

function MoneyField({ label, value, onChange, disabled, fullWidth }: MoneyFieldProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value !== null && value !== undefined) {
      setDisplayValue(value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
    setDisplayValue(e.target.value);

    if (input === '') {
      onChange(null);
      return;
    }

    const numValue = parseFloat(input);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    if (value !== null && value !== undefined) {
      setDisplayValue(
        value.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  return (
    <TextField
      label={label}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: <span style={{ marginRight: 8 }}>R$</span>,
      }}
    />
  );
}

export default MoneyField;

