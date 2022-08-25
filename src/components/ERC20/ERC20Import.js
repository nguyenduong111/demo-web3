import { useState, useEffect } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./style.css";

import BalanceOf from "./ImportMenu/BalanceOf";
import Transfer from "./ImportMenu/Transfer";
import ApproveList from "./ImportMenu/ApproveList";
import Allowance from "./ImportMenu/Allowance";
import Mint from "./ImportMenu/Mint";
import Approve from "./ImportMenu/Approve";
import Burn from "./ImportMenu/Burn";
import Web3 from "web3/dist/web3.min.js"; // webpack < 5
import AddMinter from "./ImportMenu/AddMinter";
import RemoveMinter from "./ImportMenu/RemoveMinter";
import MinterConsensus from "./ImportMenu/MinterConsensus";
import MinterReject from "./ImportMenu/MinterReject";
import MintConsensus from "./ImportMenu/MintConsensus";
import TransferFrom from "./ImportMenu/TransferFrom";
import { useSelector } from "react-redux";
import PayIn from "./ImportMenu/PayIn";
import Payout from "./ImportMenu/Payout";
import CheckTimeLock from "./ImportMenu/Checktimelock";
import ImportTokenAddress from "./ImportMenu/ImportTokenAddress";
import SetBeneficiaryAmounts from "./ImportMenu/SetBeneficiaryAmounts";
import SetTimesAndRate from "./ImportMenu/SetTimesAndRate";
import StartRelease from "./ImportMenu/StartRelease";
import CheckTime from "./ImportMenu/CheckTime";
import Release from "./ImportMenu/Release";

import Stake from "./ImportMenu/Stake";
import ViewTimeUntilWithDrawFullTime from "./ImportMenu/viewTimeUntilWithDrawFullTime";
import WithdrawFulltime from "./ImportMenu/WithdrawFulltime";
import ForceWithdraw from "./ImportMenu/ForceWithdraw";

const ERC20Import = () => {
    
    let stakingAddress = "0x964E9fcf3DAA4669f6CF6af56ae0C4bD1e9cB4eb";
    let tokenAddress = "0xA391333DB47C7DB976343076BF7Aa52fAaF09f93";
    // let timeLockAddress = "0xc2bf3a6e055a5B47A0c9Df125acf3ED5602C985a";


    // console.log("tokenAddress", tokenAddress);
    const ERC20Token = require("./ERC20Token");
    const TimeLockABI = require("./TimeLock");
    const StakingABI = require("./Staking");

    const { applyDecimals } = require("../../utils/ethereumAPI");

    const web3 = useSelector((state) => state.web3Library);
    let web3Token = new web3.eth.Contract(ERC20Token.abi, tokenAddress);

    let web3Staking = new web3.eth.Contract(StakingABI, stakingAddress);
    // var netWork;
    
    const [tokenRefresh, setTokenRefresh] = useState(0);
    const [logMessage, setLogMessage] = useState("");
    const [tokenData, setTokenData] = useState([
        { id: 0, name: "Address", value: tokenAddress },
        { id: 1, name: "Name", value: "" },
        { id: 2, name: "Symbol", value: "" },
        { id: 3, name: "TotalSupply", value: "" },
        { id: 4, name: "Decimals", value: "" },
        { id: 5, name: "Current balance", value: "" },
        { id: 6, name: "Current address", value: "" },
    ]);
    const [accMinterList, setAccMinterList] = useState([]);
    const [minterConsensusList, setMinterConsensusList] = useState([]);
    const [netWork, setNetWork] = useState("");

    const columns = [
        { field: "name", headerName: "Token", width: 150 },
        { field: "value", headerName: "Value", width: 500 },
    ];

    const fetchData = async () => {
        // web3Token = new web3.eth.Contract(
        //     ERC20Token.abi,
        //     tokenAddress
        // );
        web3.eth.net.getNetworkType((err, kq) => {
            // console.log("err---", err);
            // console.log("kq---", kq);
            setNetWork(kq);
        });

        const accounts = await web3.eth.getAccounts();
        console.log("import", accounts);
        console.log("web3Token", web3Token);
        const name = await web3Token.methods.name().call();
        const symbol = await web3Token.methods.symbol().call();
        const totalSupply = await web3Token.methods.totalSupply().call();
        const decimals = await web3Token.methods.decimals().call();

        const currentBalance = await web3Token.methods
            .balanceOf(accounts[0])
            .call();
        const listMinter = await web3Token.methods.getMinters().call();
        console.log("accounts", accounts);
        console.log("listMinter", listMinter);
        setTokenData((tokenData) => [
            // tokenData[0], 
            { ...tokenData[0], value: `${tokenAddress} (${netWork})` },
            { ...tokenData[1], value: name },
            { ...tokenData[2], value: symbol },
            {
                ...tokenData[3],
                value: applyDecimals(totalSupply, decimals),
            },
            { ...tokenData[4], value: decimals },
            {
                ...tokenData[5],
                value: applyDecimals(currentBalance, decimals),
            },
            { ...tokenData[6], value: accounts[0] },
        ]);

        
        var arr = [];
        listMinter.map((x) => {
            var temp = { status: 0, value: x };
            arr.push(temp);
        });
        for (let i = 0; i < minterConsensusList.length; i++) {
            arr.map((x) => {
                if (x.value === minterConsensusList[i]) {
                    x.status = 1;
                }
            });
        }
       
        setAccMinterList(arr);
    }

    useEffect(() => {
        // web3Token = new web3.eth.Contract(ERC20Token.abi, tokenAddress);
        fetchData();
        // console.log("abc----", netWork);
    }, [tokenRefresh]);

    const refreshDataGrid = () => setTokenRefresh((t) => ++t);
    const listConsensus = (x) => {
        setMinterConsensusList([...minterConsensusList, x]);
    };
    const listReject = (x) => {
        console.log("reject", x);
        console.log("consensus", minterConsensusList);
        var arr1 = [];
        for (let i = 0; i < minterConsensusList.length; i++) {
            if (minterConsensusList[i] !== x) {
                arr1.push(minterConsensusList[i]);
            }
            console.log("arr", arr1);
        }
        setMinterConsensusList(arr1);
    };
    // const onConsensus = async () => {
    //   const accounts = await web3.eth.getAccounts();
    //   return await web3Token.methods.minterConsensus().send({ from: accounts[0] });
    // };
    return (
        <div>
            <div className="icon">
                <img
                    src="letter-i.png"
                    style={{ width: "100%", height: "100%" }}
                ></img>
                <div className="infor">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ m: 1 }}
                            >
                                Token infor
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ height: "500px" }}>
                            <DataGrid
                                rows={tokenData}
                                columns={columns}
                            ></DataGrid>
                        </Grid>
                        <Button
                            style={{
                                backgroundColor: "antiquewhite",
                                position: "relative",
                                left: "20px",
                                top: "5px",
                            }}
                            onClick={() => setTokenRefresh((t) => ++t)}
                        >
                            Refresh
                        </Button>
                        <Grid item xs={12} sx={{ height: "150px" }}>
                            Account minter
                            <div>
                                {accMinterList.map((x) => {
                                    if (x.status) {
                                        return (
                                            <li
                                                key={x.value}
                                                style={{ color: "green" }}
                                            >
                                                {x.value}
                                            </li>
                                        );
                                    } else {
                                        return (
                                            <li
                                                key={x.value}
                                                style={{ color: "red" }}
                                            >
                                                {x.value}
                                            </li>
                                        );
                                    }
                                })}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <div>Stake address: {stakingAddress}</div>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Mint
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <BalanceOf web3Token={web3Token} tokenData={tokenData} />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Approve
                    web3Token={web3Token}
                    refreshDataGrid={refreshDataGrid}
                    tokenData={tokenData}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Allowance
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <div>------------------------------------------------------------------------------</div>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Stake
                    web3Staking={web3Staking}
                    refreshDataGrid={refreshDataGrid}
                    tokenData={tokenData}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <ViewTimeUntilWithDrawFullTime
                    web3Staking={web3Staking}
                    refreshDataGrid={refreshDataGrid}
                    tokenData={tokenData}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <WithdrawFulltime
                    web3Staking={web3Staking}
                    refreshDataGrid={refreshDataGrid}
                    tokenData={tokenData}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <ForceWithdraw
                    web3Staking={web3Staking}
                    refreshDataGrid={refreshDataGrid}
                    tokenData={tokenData}
                />
            </Box>
            {/* <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <TransferFrom
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box> */}
            {/* <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <SetBeneficiaryAmounts
                    web3Time={web3Time}
                    tokenAddress={tokenAddress}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <SetTimesAndRate
                    web3Time={web3Time}
                    tokenAddress={tokenAddress}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <StartRelease
                    web3Time={web3Time}
                    tokenAddress={tokenAddress}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <CheckTime
                    web3Time={web3Time}
                    tokenAddress={tokenAddress}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Release
                    web3Time={web3Time}
                    tokenAddress={tokenAddress}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box> */}
            {/* <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Burn
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <BalanceOf web3Token={web3Token} tokenData={tokenData} />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Transfer
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <ApproveList
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Allowance
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Mint
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <AddMinter
                    web3Token={web3Token}
                    tokenData={tokenData}
                    accMinterList={accMinterList}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <RemoveMinter
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <MinterConsensus
                    web3Token={web3Token}
                    tokenData={tokenData}
                    listConsensus={listConsensus}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <MinterReject
                    web3Token={web3Token}
                    tokenData={tokenData}
                    listReject={listReject}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <MintConsensus
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Approve
                    web3Token={web3Token}
                    refreshDataGrid={refreshDataGrid}
                    tokenData={tokenData}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <TransferFrom
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <PayIn
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Payout
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <CheckTimeLock
                    web3Token={web3Token}
                    tokenData={tokenData}
                    refreshDataGrid={refreshDataGrid}
                />
            </Box> */}
           
        </div>
    );
};

export default ERC20Import;


