import { IconButton, Tooltip } from '@mui/material';
import { OpenInNew, DriveFolderUpload, Link as LinkIcon } from '@mui/icons-material';

interface LinkButtonProps {
  url: string;
  type?: 'drive' | 'clickup' | 'system' | 'default';
}

function LinkButton({ url, type = 'default' }: LinkButtonProps) {
  if (!url || url === '#N/D' || url === '#N/A') {
    return null;
  }

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getIcon = () => {
    switch (type) {
      case 'drive':
        return <DriveFolderUpload fontSize="small" />;
      case 'clickup':
        return <LinkIcon fontSize="small" />;
      default:
        return <OpenInNew fontSize="small" />;
    }
  };

  const getTooltip = () => {
    switch (type) {
      case 'drive':
        return 'Abrir Google Drive';
      case 'clickup':
        return 'Abrir ClickUp';
      default:
        return 'Abrir link';
    }
  };

  return (
    <Tooltip title={getTooltip()}>
      <IconButton size="small" onClick={handleClick}>
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}

export default LinkButton;

