import { Checkbox, FormControlLabel } from '@mui/material';

interface CheckboxFieldProps {
  label: string;
  value: boolean | null | undefined;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function CheckboxField({ label, value, onChange, disabled }: CheckboxFieldProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value === true}
          indeterminate={value === null || value === undefined}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
      }
      label={label}
    />
  );
}

export default CheckboxField;

