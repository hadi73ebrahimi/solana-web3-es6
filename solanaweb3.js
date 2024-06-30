import * as solanaWeb3 from '@solana/web3.js'
import {Buffer} from 'buffer'

window.Buffer = Buffer;

var web3connection = null;
var walletConnection = null;

var RpcUrl = "";

async function SetupWeb3()
{
    console.log("SetupWeb3")
    web3connection =  new solanaWeb3.Connection(RpcUrl, 'confirmed');
}

async function Connect(callback) {
    try {
        walletConnection = await window.solana.connect();
    } catch (error) {
    
    }

    if(IswalletConnected())
    {
       await SetupWeb3();
    }   

    if(callback!=null)
    {
        callback(walletConnection!=null)
    }
    
}

function IswalletConnected()
{
    return walletConnection!=null
}

async function SpendSolana(to,amount)
{
    let publicKey =  walletConnection.publicKey;
    let transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new solanaWeb3.PublicKey(to),
            lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
        })
    );
    console.log(transaction)



    try {
        const { blockhash } = await web3connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signedTransaction = await window.solana.signTransaction(transaction);
        const signature = await web3connection.sendRawTransaction(signedTransaction.serialize());

        await web3connection.confirmTransaction(signature, 'confirmed');
        console.log('Transaction successful with signature:', signature);
        alert(`Transaction successful with signature: ${signature}`);
    } catch (err) {
        console.error('Transaction failed:', err);
        
        alert('Transaction failed');
    }

}

async function SpendToken(contract,to,amount) {
    const fromPublicKey = walletConnection.publicKey;
    const toPublicKey = new PublicKey(to);
    const usdcMint = new PublicKey(contract);

    // Load the USDC token associated account of the sender
    const fromTokenAccount = await Token.getAssociatedTokenAddress(
        TOKEN_PROGRAM_ID,
        usdcMint,
        fromPublicKey
    );

    // Load the USDC token associated account of the receiver
    let toTokenAccount = await Token.getAssociatedTokenAddress(
        TOKEN_PROGRAM_ID,
        usdcMint,
        toPublicKey
    );

    // Create the transaction instruction
    const transferInstruction = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount,
        toTokenAccount,
        fromPublicKey,
        [],
        amount
    );

    // Create and sign the transaction
    const transaction = new Transaction().add(transferInstruction);
    transaction.feePayer = fromPublicKey;
    const { blockhash } = await web3connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;

    try {
        const signedTransaction = await fromWallet.signTransaction(transaction);
        const signature = await web3connection.sendRawTransaction(signedTransaction.serialize());

        await web3connection.confirmTransaction(signature, 'confirmed');
        console.log('Transaction successful with signature:', signature);
        return signature;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}