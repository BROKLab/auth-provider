import { Box, Footer as GrommetFooter, Text } from 'grommet';
import React from 'react';

interface Props { }

export const Footer: React.FC<Props> = ({ ...props }) => {

    return (
        <GrommetFooter background="brand" pad="medium" height={{ min: "10vh" }}>
            <Box align="center" justify="center" alignContent="center" fill="horizontal" >
                <Text textAlign="center" size="small">
                    {/* <Paragraph>Autentisering</Paragraph> */}
                </Text>
            </Box>
        </GrommetFooter>
    )
}