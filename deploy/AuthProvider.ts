module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
  await deploy("AuthProvider", {
    from: deployer,
    // gas: 4000000,
    args: [["0xbb1c879cb7f5129ba026DfE1E5f30979D7978A65"]], //
  });
};
