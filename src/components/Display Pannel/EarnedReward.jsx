import { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import web3Context from "../../context/Web3Context";
import { toast } from "react-hot-toast";
import "./DisplayPannel.css";

const EarnedReward = () => {
  const { stakingContract, selectedAccount } = useContext(web3Context);
  const [rewardVal, setRewardVal] = useState("0");

  useEffect(() => {
    const fetchStakeRewardInfo = async () => {
      try {
        if (!stakingContract) throw new Error("Staking contract not initialized");
        if (!selectedAccount) throw new Error("Selected account not initialized");
  
        // Log current contract state and account information
        console.log("Selected Account:", selectedAccount);
        console.log("Staking Contract Address:", stakingContract.address);
  
        const rewardValueWei = await stakingContract.earned(selectedAccount);
        console.log("Reward Value in Wei:", rewardValueWei);  // Log the fetched reward value
  
        const rewardValueEth = ethers.formatUnits(rewardValueWei, 18).toString();
        const roundedReward = parseFloat(rewardValueEth).toFixed(2);
        setRewardVal(roundedReward);
      } catch (error) {
        toast.error("Error fetching the reward");
        console.error("Error fetching reward:", error);
      }
    };
  
    const interval = setInterval(() => {
      if (stakingContract && selectedAccount) {
        fetchStakeRewardInfo();
      }
    }, 20000);
  
    if (stakingContract && selectedAccount) {
      fetchStakeRewardInfo();
    }
  
    return () => clearInterval(interval);
  }, [stakingContract, selectedAccount]);
  
  return (
    <div className="earned-reward">
      <p>Earned Reward:</p>
      <span>{rewardVal}</span>
    </div>
  );
};

export default EarnedReward;
