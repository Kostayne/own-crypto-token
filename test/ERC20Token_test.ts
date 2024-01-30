import { ethers } from 'hardhat';
import { expect } from 'chai';

const defaultCfg = {
    tokenName: 'Kostayne Token',
    tokenSymbol: 'KST',
    initBalance: 5000,
};

const deploy = async (cfg = defaultCfg) => {
    const [owner] = await ethers.getSigners();
    const token = await ethers.deployContract('MyToken', [cfg.tokenName, cfg.tokenSymbol, owner, cfg.initBalance]);

    return [token, owner] as const;
};

describe('Token contract', () => {
    it('Should assign the owner balance to initBalance', async () => {
        const [token, owner] = await deploy();
        const ownerBalance = await token.balanceOf(owner.address);

        expect(ownerBalance).to.equal(defaultCfg.initBalance);
    });

    it('Should assign the total supply of tokens to the owner', async () => {
        const [token, owner] = await deploy();
        const ownerBalance = await token.balanceOf(owner.address);
        const totalSupply = await token.totalSupply();

        expect(totalSupply).to.equal(ownerBalance);
    });

    it('Should not allow initBalance < 0', async () => {
        expect(() => deploy({...defaultCfg, initBalance: -1})).to.be.revertedWith('Balance can\'t be negative');
    });

    it('Should not allow empty symbol name', async () => {
        expect(() => deploy({
            ...defaultCfg, 
            tokenSymbol: '',
        })).to.be.revertedWith('Empty token symbol!');
    });

    it('Should not allow empty token name', async () => {
        expect(() => deploy({
            ...defaultCfg, 
            tokenName: '',
        })).to.be.revertedWith('Empty token name!');
    });

    it('Should transfer tokens to another address', async () => {
        const [token, owner] = await deploy();
        const addr2 = (await ethers.getSigners())[1].address;

        const amount = 15;

        await token.addToWhiteList(addr2);
        await token.transfer(addr2, amount);

        const ownerBalance = await token.balanceOf(owner.address);
        const addr2Balance = await token.balanceOf(addr2);

        expect(ownerBalance).to.eq(defaultCfg.initBalance - amount);
        expect(addr2Balance).to.eq(amount);
    });

    it('Should not transfer tokens to non white listed address', async () => {
        const [token] = await deploy();
        const addr2 = (await ethers.getSigners())[1].address;

        const amount = 15;

        const transfer = async () => {
            await token.transfer(addr2, amount);
        }

        expect(transfer).revertedWith('Illegal transfer to non white listed address!');
    });

    it('Should not transfer tokens to self', async () => {
        const [token, owner] = await deploy();

        const transfer = async () => {
            await token.transfer(owner, 15);
        };

        expect(transfer).revertedWith('You can\'t transfer to your self');
    });

    it('Should not transfer amount <= 0', async () => {
        const [token] = await deploy();
        const addr2 = (await ethers.getSigners())[1].address;

        const transfer = async () => {
            await token.transfer(addr2, -15);
        };

        expect(transfer).revertedWith('Value must be greater than zero');
    });

    it('Should not transfer amount > balance', async () => {
        const [token] = await deploy();
        const addr2 = (await ethers.getSigners())[1];

        const transfer = async () => {
            await token.transfer(addr2, defaultCfg.initBalance + 1);
        };

        expect(transfer).revertedWith('Not enough balance');
    });

    it('Should not allow to transfer to 0x0', async () => {
        const [token] = await deploy();

        const transfer = async () => {
            await token.transfer(ethers.ZeroAddress, 1);
        };

        expect(transfer).revertedWith("Can not transfer to zero address");
    });

    it('Should allow minting tokens', async () => {
        const [token] = await deploy();
        const addr2 = (await ethers.getSigners())[1].address;

        const amount = 15000;
        await token.mint(addr2, amount);

        const addr2Balance = await token.balanceOf(addr2);
        const supply = await token.totalSupply();

        expect(addr2Balance).to.eq(amount);
        expect(supply).to.eq(defaultCfg.initBalance + amount);
    });

    it('Should not allow minting tokens to 0x0', async () => {
        const [token] = await deploy();
        const amount = 15000;

        const mint = async () => {
            await token.mint(ethers.ZeroAddress, amount);
        }

        expect(mint).revertedWith("Can not mint to zero address");
    });

    it('Should not allow minting tokens <= 0', async () => {
        const [token] = await deploy();
        const addr2 = (await ethers.getSigners())[1].address;

        const mint = async () => {
            await token.mint(addr2, 0);
        }

        expect(mint).revertedWith('Can not mint value less or equal zero');
    });

    it('Should allow burning tokens', async () => {
        const [token] = await deploy();

        const amount = 15;
        await token.burn(amount);

        const supply = await token.totalSupply();
        expect(supply).to.eq(defaultCfg.initBalance - amount);
    });

    it('Should not allow burning if value <= 0', async () => {
        const [token] = await deploy();

        const burn = async () => {
            await token.burn(-15);
        };

        expect(burn).to.revertedWith('Can\'t burn value <= 0');
    });

    it('Should not allow burning if value > balance', async () => {
        const [token] = await deploy();

        const burn = async () => {
            await token.burn(defaultCfg.initBalance + 1);
        };

        expect(burn).revertedWith('Value to burn is greater than address balance');
    });

    // There are a lot of tests need to be written
    // I would say it's too many for the not production contract
    // However, if you want to add more, you always can send a pull request

    // Not completed test cases:
    // - transferFrom
    // - approve
    // - allowance
    // - only admin
    // - paused
    // ...
});