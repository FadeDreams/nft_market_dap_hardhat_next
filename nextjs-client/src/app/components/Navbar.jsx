import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:text-blue-200">
            Home
          </Link>
        </li>
        <li>
          <Link href="/sell-nft" className="text-white hover:text-blue-200">
            Sell NFT
          </Link>
        </li>
        <li>
          <Link href="/create-nft" className="text-white hover:text-blue-200">
            Create NFT
          </Link>
        </li>
        <li>
          <Link href="/my-nft" className="text-white hover:text-blue-200">
            My NFT
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="text-white hover:text-blue-200">
            Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
