import React from 'react';
import { Box, Paragraph, Footer as GrommetFooter, Text } from 'grommet';

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