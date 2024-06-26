"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { ethers, providers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { contractAddress, LOCALHOST_URL } from "./config/config";
import NFTMarketplace from './abi/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(LOCALHOST_URL);
    const marketContract = new ethers.Contract(contractAddress, NFTMarketplace.abi, provider);
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await marketContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        name: meta.data.name,
        image: meta.data.image,
        description: meta.data.description
      };

      return item;
    }));

    setNfts(items);
    setLoadingState('loaded');
  }

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const getnetwork = await provider.getNetwork();
    // const goerliChainId = 5;
    // if (getnetwork.chainId != goerliChainId) {
    //   alert("You are not connected to Goerli network");
    //   return;
    // }
    const localhostChainId = 31337;
    if (getnetwork.chainId != localhostChainId) {
      alert("You are not connected to localhost network");
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, NFTMarketplace.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    await transaction.wait();
    loadNFTs();
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  if (!loadingState) return (
    <h1 className='px-20 py-10 text-3xl'>Wait Loading.......</h1>
  )

  if (loadingState && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No Items in marketplace</h1>
  )

  return (
    <main className={styles.main}>
      <div className=''>
        {
          nfts.map((nft, i) => (
            <div key={i} className='border shadow rounded-xl overflow-hidden mx-5 my-5'>
              <Image src={nft.image} alt={nft.name} width={300} height={200} placeholder="blur" blurDataURL='/placeholder.png' layout='responsive' />
              <div className='p-4'>
                <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <p className='text-gray-400'>{nft.description}</p>
                </div>
              </div>
              <div className='p-4 bg-black'>
                <p className='text-2xl mb-4 font-bold text-white'>{nft.price} ETH</p>
                <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={() => buyNFT(nft)}>Buy now</button>
              </div>
            </div>
          ))
        }
      </div>

    </main>
  );
}
