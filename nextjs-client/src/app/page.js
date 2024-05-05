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
    const data = await marketContract.fetchMarketItems(); // All unsold nfts

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
      home
    </main>
  );
}
