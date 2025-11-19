import { expect } from "chai";
import { ethers } from "hardhat";

describe("ArtyugaArtwork", function () {
  let artyugaArtwork;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ArtyugaArtwork = await ethers.getContractFactory("ArtyugaArtwork");
    artyugaArtwork = await ArtyugaArtwork.deploy(owner.address);
    await artyugaArtwork.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await artyugaArtwork.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await artyugaArtwork.name()).to.equal("Artyuga Artwork");
      expect(await artyugaArtwork.symbol()).to.equal("ARTYUGA");
    });
  });

  describe("Minting", function () {
    it("Should mint artwork to specified address", async function () {
      const tokenURI = "https://example.com/artwork/1";
      const tx = await artyugaArtwork.mintArtwork(addr1.address, tokenURI);
      await tx.wait();

      expect(await artyugaArtwork.ownerOf(1)).to.equal(addr1.address);
      expect(await artyugaArtwork.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should increment token ID", async function () {
      await artyugaArtwork.mintArtwork(addr1.address, "uri1");
      await artyugaArtwork.mintArtwork(addr2.address, "uri2");

      expect(await artyugaArtwork.totalMinted()).to.equal(2);
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(
        artyugaArtwork.connect(addr1).mintArtwork(addr2.address, "uri")
      ).to.be.reverted;
    });
  });

  describe("getArtwork", function () {
    it("Should return correct owner and URI", async function () {
      const tokenURI = "https://example.com/artwork/1";
      await artyugaArtwork.mintArtwork(addr1.address, tokenURI);

      const [ownerAddress, uri] = await artyugaArtwork.getArtwork(1);
      expect(ownerAddress).to.equal(addr1.address);
      expect(uri).to.equal(tokenURI);
    });
  });
});

