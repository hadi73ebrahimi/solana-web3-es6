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