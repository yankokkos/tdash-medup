import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  label?: string;
}

function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label ? `${label} copiado!` : 'Copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <Tooltip title={copied ? 'Copiado!' : 'Copiar'}>
      <IconButton size="small" onClick={handleCopy}>
        {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

export default CopyButton;

