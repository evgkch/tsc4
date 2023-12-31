import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task5 are ready to use
    });

    // it('n = 10, k = 0', async () => {
    //     const res = await task5.getFibonacciSequence(10n, 0n);
    //     console.log(res); // should be []
    // });

    // it('n = 10, k = 0', async () => {
    //     const res = await task5.getFibonacciSequence(0n, 10n);
    //    console.log(res); // should be [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    // });

    // it("n = 201, k = 4", async () => {
    //     const res = await task5.getFibonacciSequence(201n, 4n);
    //     console.log(res);
    //     // should be [
    //     //     453973694165307953197296969697410619233826n,
    //     //     734544867157818093234908902110449296423351n,
    //     //     1188518561323126046432205871807859915657177n,
    //     //     1923063428480944139667114773918309212080528n
    //     // ]);
    // });

    // it("n = 0, k = 255", async () => {
    //     const res = await task5.getFibonacciSequence(0n, 255n);
    //     console.log(res);

    //     // should work
    // });

});