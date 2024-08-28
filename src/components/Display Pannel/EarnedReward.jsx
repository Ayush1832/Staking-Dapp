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
        const rewardValueWei = await stakingContract.earned(selectedAccount);
        const rewardValueEth = ethers.formatUnits(rewardValueWei, 18).toString();
        const roundedReward = parseFloat(rewardValueEth).toFixed(2);
        setRewardVal(roundedReward);
      } catch (error) {
        toast.error("Error fetching the reward:");
        console.error("Error fetching reward:", error);
      }
    };

    const interval = setInterval(() => {
      stakingContract && fetchStakeRewardInfo();
    }, 20000);

    if (stakingContract && selectedAccount) {
      fetchStakeRewardInfo();
    }

    return () => clearInterval(interval);
  }, [stakingContract, selectedAccount]);

  const claimRewards = async () => {
    try {
      const rewardValueWei = await stakingContract.earned(selectedAccount);
      if (rewardValueWei.toString() === "0") {
        toast.error("No rewards to claim.");
        return;
      }
  
      const transaction = await stakingContract.getReward({ gasLimit: 2000000 });
      await toast.promise(transaction.wait(), {
        loading: "Claiming rewards...",
        success: "Rewards claimed successfully!",
        error: "Failed to claim rewards",
      });
      setRewardVal("0");
    } catch (error) {
      toast.error("Error claiming rewards");
      console.error("Error claiming rewards:", error);
    }
  };
  


  return (
    <div className="earned-reward">
      <p>Earned Reward:</p>
      <span>{rewardVal}</span>
      <button onClick={claimRewards} className="claim-rewards-button">
        Claim Rewards
      </button>
    </div>
  );
};

export default EarnedReward;
