import { Box, Header, Heading } from 'grommet';
import React from 'react';

interface Props { }

export const Navigation: React.FC<Props> = () => {
    // const size = React.useContext(ResponsiveContext);
    return (
        <Header background="brand-contrast" pad="small" height={{ min: "15vh" }}>
            <Box>
                <Heading level="2">BankID autentisering</Heading>
            </Box>
            <Box direction="row" gap="small" >
                {/* <Link to="/something">
                    <Button size="small" label="Something" hoverIndicator focusIndicator={false} />
                </Link> */}
            </Box>
            {/* <Box direction="row" gap="small" >
                <Button disabled={true}>Account</Button>
            </Box> */}
        </Header>
    )
}