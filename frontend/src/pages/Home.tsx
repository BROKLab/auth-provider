import { Box } from 'grommet';
import React from 'react';
import { Bankid } from '../components/bankId/Bankid';

interface Props { }

export const Home: React.FC<Props> = () => {

    return (
        <Box align="center">
            <Bankid></Bankid>
        </Box>
    )
}