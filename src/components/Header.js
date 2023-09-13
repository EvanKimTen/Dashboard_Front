import { Box, Container, CssBaseline, Typography } from "@mui/material"


const Header = ({ name }) => {
    return (
        <>
        <CssBaseline />
            <Box sx={{ position: 'fixed', width: '100%', bgcolor: '#FFFFFF', height: '60px', borderBottom: "0.5px solid grey", zIndex: '100', display: 'flex', alignItems: 'center'}}>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', marginLeft: '2rem'}}>{name}</Typography>
            </Box>
        </>

    )
}

export default Header