import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    // it("simple test", async () => {
    //     const rand = 0b110001100110000n;
    //     const node = beginCell().storeUint(rand, 15).endCell();
    //     const linked_list = beginCell().storeUint(rand, 15).storeRef(node).endCell();
    //     const target = await task3.getFindAndReplace(0b11n, 0b1111n, linked_list);
    //     expect(BigInt(target.beginParse().loadUint((15 + 3 * 2) * 2))).toBe(0b111100011110011110000111100011110011110000n);
    // });

    // it("nice test", async () => {
    //     const rand = 0b11000110011000000n;
    //     const node = beginCell().storeUint(rand, 17).endCell();
    //     const linked_list = beginCell().storeUint(rand, 17).storeRef(node).endCell();
    //     const target = await task3.getFindAndReplace(0b11n, 0b1111n, linked_list);
    //     expect(BigInt(target.beginParse().loadUint((17 + 3 * 2) * 2))).toBe(0b1111000111100111100000011110001111001111000000n);
    // });

    // it("another test", async () => {
    //     const rand = 0b110001100110000n;
    //     const node = beginCell().storeUint(rand, 15).endCell();
    //     const linked_list = beginCell().storeUint(rand, 15).storeRef(node).endCell();
    //     const target = await task3.getFindAndReplace(0b11n, 0b1000n, linked_list);
    //     expect(BigInt(target.beginParse().loadUint((15 + 3 * 2) * 2))).toBe(0b100000010000010000000100000010000010000000n);
    // });

    // it("big test", async () => {
    //     const rand = BigInt("0b" + Array.from({ length: 1023 }, () => 1).join(''));
    //     let res = BigInt("0b" + Array.from({ length: 1023 }, (_, i) => i & 1 ? 0 : 1).join(''));
    //     res -= 1n;
    //     console.log(res.toString(2), rand.toString(2));
    //     const node = beginCell().storeUint(rand, 1023).endCell();
    //     const linked_list = beginCell().storeUint(rand, 1023).storeRef(node).endCell();
    //     const target = await task3.getFindAndReplace(0b11n, 0b10n, linked_list);
    //     console.log(target.beginParse().loadBits(1023).toString());

    //     //expect(BigInt(target.beginParse().loadUint(102))).toBe(res);
    // });

    // it("mini test", async () => {
    //                    //1111000010110111
    //     const rand = 0b1100000010110000n;
    //     const linked_list = beginCell().storeUint(rand, rand.toString(2).length).endCell();
    //     const target = await task3.getFindAndReplace(0b1100n, 0b1111n, linked_list);
    //     console.log(target.beginParse().loadUint(16).toString(2));

    //     //expect(BigInt(target.beginParse().loadUint(4))).toBe(0b10);
    // });
});
