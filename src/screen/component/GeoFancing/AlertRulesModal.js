import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

const icons = {
  'Geofence Exit Alert': <RoomOutlinedIcon sx={{ fontSize: 18, color: '#1976d2' }} />,
  'Late Arrival Detection': <AccessTimeIcon sx={{ fontSize: 18, color: '#0288d1' }} />,
  'Unauthorized Area Access': <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: '#d32f2f' }} />,
};

const AlertRulesModal = ({ open, onClose, rules, onToggle }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: 18, fontWeight: 'bold', pb: 0 }}>
        Alert Rules Configuration
      </DialogTitle>

      <DialogContent>
        <Typography fontSize={13} color="text.secondary" mb={2}>
          Define rules for automatic alert generation. Configure conditions and actions for different scenarios.
        </Typography>

        {/* Info box */}
        <Box
          sx={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography fontSize={14} fontWeight="bold" mb={0.5}>
            ⚙️ Alert rules are active
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Rules will automatically create alerts based on your configurations.
          </Typography>
        </Box>

        {/* Header and Add Rule Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography fontWeight="bold" fontSize={14}>
            Active Rules ({rules.length}/3)
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none', fontSize: 13, borderRadius: 2 }}
          >
            Add Rule
          </Button>
        </Box>

        {/* Rules List */}
        {rules.map((rule, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: idx < rules.length - 1 ? '1px solid #eee' : 'none',
              px: 2,
              py: 1.5,
            }}
          >
            {/* Left side: Toggle + Icon + Label */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`toggle-${idx}`}
                  checked={rule.enabled}
                  onChange={() => onToggle(idx)}
                  style={{ width: 40, height: 20, cursor: 'pointer' }}
                />
              </div>
              {icons[rule.name]}
              <Typography fontSize={14}>{rule.name}</Typography>
            </Box>

            {/* Right side: Priority chip */}
            <Chip
              label={rule.priority}
              size="small"
              color={priorityColors[rule.priority]}
              sx={{
                fontSize: '12px',
                height: '24px',
                fontWeight: 500,
                borderRadius: 1,
              }}
            />
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: 'none', fontSize: 13, borderRadius: 2 }}
        >
          Close
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ textTransform: 'none', fontSize: 13, borderRadius: 2 }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertRulesModal;
