import { React, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import theme from '../theme';

const ContenedorInput = styled.div`
	input {
		font-family: 'Work Sans', sans-serif;		
		box-sizing: border-box;
		background: ${theme.grisClaro};
		border: none;
		cursor: pointer;
		border-radius: 0.625rem; /* 10px */
		height: 5rem; /* 80px */
		width: 100%;
		padding: 0 1.25rem; /* 20px */
		font-size: 1.5rem; /* 24px */
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media(max-width: 60rem){ /* 950px */
		& > * {
			width: 100%;
		}
	}
`;


const DatePicker = ({ fecha, cambiarFecha }) => {
	const [date, setDate] = useState(dayjs(new Date()));

	const handleChange = (date) => cambiarFecha(date);

	return (
		<ContenedorInput>
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
				<Stack spacing={3}>
					<DesktopDatePicker

						inputFormat="DD/MM/YYYY"
						parseInputValue={value => dayjs(value, new Date())}
						value={fecha}
						for
						onChange={handleChange}
						renderInput={(params) => <TextField {...params} />}
					/>
				</Stack>
			</LocalizationProvider>
		</ContenedorInput>
	);
}

export default DatePicker;