'use client'
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  NativeSelect,
  Switch,
} from "@mui/material";
import { useEffect } from "react";
import commonStyles from '@/styles/commonstyle.module.scss'
import styles from "@/styles/staking.module.scss"

// import { useButtonGroupStyle, usestyles } from "./style";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

const iconSearch = "/assets/images/icon-search.svg";

export const DURATION_LIVE = "live";
export const DURATION_FINISHED = "finished";

export const POOL_TYPE_ALLOC = "alloc";
export const POOL_TYPE_LINEAR = "linear";

export const BENEFIT_ALL = "all";
export const BENEFIT_IDO_ONLY = "ido-only";
export const BENEFIT_REWARD_ONLY = "reward-only";

const StakingHeader = (props: any) => {
  const {
    durationType,
    setDurationType,
    poolType,
    setPoolType,
    stakedOnly,
    setStakedOnly,
    benefitType,
    setBenefitType,
    searchString,
    setSearchString,
  } = props;

  const searchParams = useSearchParams();
  const router = useRouter();


  useEffect(() => {
    const queryBenefit = searchParams.get("benefit");
    switch (queryBenefit) {
      case BENEFIT_ALL:
      case BENEFIT_IDO_ONLY:
      case BENEFIT_REWARD_ONLY:
        setBenefitType(queryBenefit);
        break;
    }
  }, [searchParams]);

  const selectBenefitType = (type: string) => {
    setBenefitType(type);
    router.push("/staking-pools?benefit=" + type);
  };

  const getClassActive = (type: "duration" | "alloc", currentType: string) => {
    let className = "";
    if (type === "duration") {
      className =
        durationType === currentType
          ? styles.btnActive
          : styles.btnDisabled;
    }
    if (type === "alloc") {
      className =
        poolType === currentType
          ? styles.btnActive
          : styles.btnDisabled;
    }
    return className;
  };

  return (
    <div className="controller-area">
      <div className={styles.btnHeaderGroup}>
        <ButtonGroup
          color="primary"
          className={styles.group + " " + styles.btnDurationType}
          aria-label="outlined primary button group"
        >
          <Button
            className={getClassActive("duration", DURATION_LIVE)}
            onClick={() => {
              setDurationType(DURATION_LIVE);
            }}
          >
            Live
          </Button>
          <Button
            className={getClassActive("duration", DURATION_FINISHED)}
            onClick={() => {
              setDurationType(DURATION_FINISHED);
            }}
          >
            Finished
          </Button>
        </ButtonGroup>

        <ButtonGroup
          color="primary"
          style={{display: 'none'}}
          className={styles.group + " " + styles.btnStakingType}
          aria-label="outlined primary button group"
        >
          <Button
            className={getClassActive("alloc", POOL_TYPE_ALLOC)}
            onClick={() => {
              setPoolType(POOL_TYPE_ALLOC);
            }}
          >
            Allocation
          </Button>
          <Button
            className={getClassActive("alloc", POOL_TYPE_LINEAR)}
            onClick={() => {
              setPoolType(POOL_TYPE_LINEAR);
            }}
          >
            Linear Rate
          </Button>
        </ButtonGroup>
      </div>

      <FormControlLabel
        control={
          <Switch
            name="checkedB"
            checked={stakedOnly}
            onChange={(event) => {
              setStakedOnly(event.target.checked);
            }}
            classes={{
              root: styles.root,
              switchBase: styles.switchBase,
              thumb: styles.thumb,
              track: styles.track,
              checked: styles.checked,
            }}
          />
        }
        label="My Staking Pools"
        className={styles.switchGroup}
      />

      <div className="controller-area__right">
        <div className="form-control-label">
          <NativeSelect
            // defaultValue="all"
            className={styles.poolTypeSelect}
            inputProps={{
              name: "select_benefit",
              id: "select-benefit",
            }}
            value={benefitType}
            onChange={(e) => selectBenefitType(e.target.value)}
          >
            <option value="all">All pools</option>
            <option value="ido-only">With IDO pools</option>
            <option value="reward-only">Without IDO pools</option>
          </NativeSelect>
        </div>
        <div className="form-control-label">
          <div className="controller-area__search">
            <input
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              type="text"
              placeholder="Search pool name"
              className={`${commonStyles.nnn1424h} ${styles.controleForm}`}
            />
            <Image width={24} height={24} style={{position:'absolute', left:"10px", top:'18px'}} src={iconSearch} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingHeader;
