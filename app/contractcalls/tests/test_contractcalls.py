from django.test import TestCase
from contractcalls.crowdfund_abi import CROWDFUND_ABI  # Crowdfund Abi
from contractcalls.coin_abi import COIN_ABI  # Test Token Abi
from contractcalls.contractcalls import ContractFactory, EventListener, LnatSums, LendgerCrowdfund
from web3 import Web3
from decouple import config
import time
import json

# TODO: Don't print out a lot of stuff
# TODO: Check variable names / make this consistent

CONTRACT_OWNER_ADDRESS = '0x780255CEa5962854eB50e0e2233De2Cd5CDC2FcD'
COIN_ADDRESS = '0x94B0f10B8E696E082100C9B749b61eFcd8216433'
CROWDFUND_ADDRESS = '0x2b556fc8Da8b8B26BD37Fd8f0Cd3fbe6EFF55aac'
LNAT_ORACLE_ADDRESS = '0xAac2eA063E5b5E0397250343ab67C798080013Dc'
BORROWER_ADDRESS = '0x9f8ACAbf0345E0c62754E57400d1F39E113Ab231'
PKEY = config('PRIVATE_KEY_OWNER')  # hardcoded  user 0x780255CEa5962854eB50e0e2233De2Cd5CDC2FcD
CURRENT_TIME = int(time.time())


class ContractFactoryTests(TestCase):
    def test_initalize_ContractFactory_Class(self):
        """Test initalization of ContractFactory class is successful"""
        instance = ContractFactory(COIN_ABI, COIN_ADDRESS, "ropsten")

        self.assertEqual(instance.contract_address, COIN_ADDRESS)
        self.assertIsInstance(instance.web3, Web3)


class LnatHeldTests(TestCase):

    def test_fetch_lnat_count_methods(self):
        """Test LnatSums() methods that fetch and mutate data in the database (one entry per user) """
        instance = LnatSums(COIN_ABI, COIN_ADDRESS, "ropsten")
        balance_from_contract = instance.contract.contract_instance.functions.balanceOf(
            CONTRACT_OWNER_ADDRESS).call()
        instance.newLnatCount(CONTRACT_OWNER_ADDRESS)
        balance_from_database = float(instance.getLnatCount(CONTRACT_OWNER_ADDRESS)[
                                      'data']['LnatSum'][0]['lnatHeld'])

        self.assertEqual(balance_from_contract, balance_from_database)

        instance.updateLnatCount(CONTRACT_OWNER_ADDRESS)

        balance_from_contract += balance_from_contract
        updated_balance_from_database = float(
            instance.getLnatCount(CONTRACT_OWNER_ADDRESS)['data']['LnatSum'][0]['lnatHeld'])

        self.assertEqual(balance_from_contract, updated_balance_from_database)

        instance.deleteLnatCount(CONTRACT_OWNER_ADDRESS)

    def test_LNAT_difference_over_time_method(self):
        """Test LNATDifferenceOverTime() method for a variety of days"""
        instance = LnatSums(COIN_ABI, COIN_ADDRESS, "ropsten")
        current_balance = instance.contract.contract_instance.functions.balanceOf(
            CONTRACT_OWNER_ADDRESS).call()
        # have to manually update second parameter daily
        print(current_balance)
        instance.newLnatCount(CONTRACT_OWNER_ADDRESS, current_balance)
        day1 = instance.LNATDifferenceOverTime(CONTRACT_OWNER_ADDRESS, 0)
        day2 = instance.LNATDifferenceOverTime(CONTRACT_OWNER_ADDRESS, 1)
        # day3 = instance.LNATDifferenceOverTime(CONTRACT_OWNER_ADDRESS, 15)
        # day4 = instance.LNATDifferenceOverTime(CONTRACT_OWNER_ADDRESS, 16)

        self.assertEqual(0, day1)
        self.assertEqual(999181, day2)
        # self.assertEqual(13999734, day3)
        # self.assertEqual(14999722, day4)

        instance.deleteLnatCount(CONTRACT_OWNER_ADDRESS)

    def test_LNAT_Held(self):
        """Test LnatHeld() method for a variety of days"""
        instance = LnatSums(COIN_ABI, COIN_ADDRESS, "ropsten")
        # have to manually update second parameters for the 5 function calls below daily
        instance.newLnatCount(CONTRACT_OWNER_ADDRESS, 23998022)
        day1 = instance.LnatHeld(CONTRACT_OWNER_ADDRESS, 0)
        day2 = instance.LnatHeld(CONTRACT_OWNER_ADDRESS, 1)
        # day3 = instance.LnatHeld(CONTRACT_OWNER_ADDRESS, 17)
        # day4 = instance.LnatHeld(CONTRACT_OWNER_ADDRESS, 18)

        self.assertEqual(23998022, day1)
        self.assertEqual(22998841, day2)
        # self.assertEqual(5999964, day3)
        # self.assertEqual(4999976, day4)

        instance.deleteLnatCount(CONTRACT_OWNER_ADDRESS)


class EventListenerTests(TestCase):

    def test_fetch_event_methods(self):
        """Test EventListener() methods that fetch and mutate data in the database (one entry per event name) """
        # must update as more blocks are mined
        BLOCK = 6359349
        EVENT_NAME = 'Transfer'
        instance = EventListener(COIN_ABI, COIN_ADDRESS, "ropsten")
        instance.newEvent(0, BLOCK, EVENT_NAME)
        event = instance.getEvent(EVENT_NAME)[0]

        self.assertEqual(event['pastBlock'], 0)
        self.assertEqual(event['currentBlock'], BLOCK)
        self.assertEqual(event['eventName'], EVENT_NAME)

        instance.updateEvent(EVENT_NAME, BLOCK)
        currentblock = instance.contract.web3.eth.getBlock('latest')['number']
        event = instance.getEvent(EVENT_NAME)[0]

        self.assertEqual(event['pastBlock'], BLOCK)
        self.assertEqual(event['currentBlock'], currentblock)
        self.assertEqual(event['eventName'], EVENT_NAME)

        instance.deleteEvent(EVENT_NAME)

    def test_get_new_logs(self):
        """Test getNewLogs() method """
        BLOCK = 6359349
        EVENT_NAME = 'Transfer'
        instance = EventListener(COIN_ABI, COIN_ADDRESS, "ropsten")
        instance.newEvent(0, BLOCK, EVENT_NAME)
        event = instance.getEvent(EVENT_NAME)[0]

        self.assertEqual(event['pastBlock'], 0)
        self.assertEqual(event['currentBlock'], BLOCK)
        self.assertEqual(event['eventName'], EVENT_NAME)

        print(instance.getNewLogs('Transfer'))

        currentblock = instance.contract.web3.eth.getBlock('latest')['number']
        event = instance.getEvent(EVENT_NAME)[0]

        self.assertEqual(event['pastBlock'], BLOCK)
        self.assertEqual(event['currentBlock'], currentblock)
        self.assertEqual(event['eventName'], EVENT_NAME)

        instance.deleteEvent(EVENT_NAME)

    def test_run_through_events_method(self):
        """Test runThroughEvents() helper method """
        BLOCK = 6359349
        EVENT_NAME = 'Transfer'
        x = EventListener(COIN_ABI, COIN_ADDRESS, "ropsten")
        x.newEvent(0, BLOCK, EVENT_NAME)

        print(x.runThroughEvents(EVENT_NAME, BLOCK))

        x.deleteEvent(EVENT_NAME)


class LendgerCrowdfundTests(TestCase):

    def test_normal_project_lifecycle(self):
        """Test the normal lifecycle of a simple project """
        packed_attributes = 809746123864884214143481849091985570970598984406132999585992
        borrower = 0x9f8ACAbf0345E0c62754E57400d1F39E113Ab231
        initial_draw = 858993459200
        tiers = [659095682215601480202757889436804973690747321668723623854080000]
        project_id = 10
        coin_contract = ContractFactory(COIN_ABI, COIN_ADDRESS, "ropsten")
        coin_contract.createcontractinstance()
        crowdfund_class = LendgerCrowdfund(CROWDFUND_ABI, CROWDFUND_ADDRESS, "ropsten")

        print("borrower balance: ", coin_contract.contract_instance.functions.balanceOf(
            BORROWER_ADDRESS).call())
        print("sender balance: ", coin_contract.contract_instance.functions.balanceOf(
            CONTRACT_OWNER_ADDRESS).call())
        print("contract balance: ", coin_contract.contract_instance.functions.balanceOf(
            CROWDFUND_ADDRESS).call())

        if not crowdfund_class.KYC(CONTRACT_OWNER_ADDRESS):
            print("Owner not passed KYC")
            crowdfund_class.toggleKYC(CONTRACT_OWNER_ADDRESS)

        time.sleep(40)

        if not crowdfund_class.KYC(BORROWER_ADDRESS):
            print("Borrower not passed KYC")
            crowdfund_class.toggleKYC(BORROWER_ADDRESS)

        time.sleep(40)

        print("sender: ", crowdfund_class.KYC(CONTRACT_OWNER_ADDRESS))
        print("borrower_address: ", crowdfund_class.KYC(BORROWER_ADDRESS))

        crowdfund_class.changeOracle(LNAT_ORACLE_ADDRESS)

        time.sleep(40)

        crowdfund_class.createProject(9999999, packed_attributes,
                                      borrower, initial_draw, tiers, [COIN_ADDRESS])

        time.sleep(40)

        account = coin_contract.web3.eth.account.privateKeyToAccount(PKEY)
        const_txn = coin_contract.contract_instance.functions.approve(CROWDFUND_ADDRESS, 200).buildTransaction({
            'from': account.address,
            'nonce': coin_contract.web3.eth.getTransactionCount(account.address),
            'gas': 1728715,
            'gasPrice': coin_contract.web3.toWei('15', 'gwei')
        })
        signed = account.signTransaction(const_txn)
        coin_contract.web3.eth.sendRawTransaction(signed.rawTransaction)

        time.sleep(40)

        print("Allowance: ", coin_contract.contract_instance.functions.allowance(
            CONTRACT_OWNER_ADDRESS, CROWDFUND_ADDRESS).call())

        time.sleep(40)

        crowdfund_class.invest(project_id, 200, COIN_ADDRESS)

        time.sleep(40)

        print("borrower balance: ", coin_contract.contract_instance.functions.balanceOf(
            BORROWER_ADDRESS).call())
        print("sender balance: ", coin_contract.contract_instance.functions.balanceOf(
            CONTRACT_OWNER_ADDRESS).call())
        print("contract balance: ", coin_contract.contract_instance.functions.balanceOf(
            CROWDFUND_ADDRESS).call())

        time.sleep(40)

        crowdfund_class.redeemFunding(project_id)

        time.sleep(40)

        const_txn = coin_contract.contract_instance.functions.approve(CROWDFUND_ADDRESS, 220).buildTransaction({
            'from': account.address,
            'nonce': coin_contract.web3.eth.getTransactionCount(account.address),
            'gas': 1728715,
            'gasPrice': coin_contract.web3.toWei('15', 'gwei')
        })
        signed = account.signTransaction(const_txn)
        coin_contract.web3.eth.sendRawTransaction(signed.rawTransaction)

        time.sleep(40)

        print("Allowance: ", coin_contract.contract_instance.functions.allowance(
            CONTRACT_OWNER_ADDRESS, CROWDFUND_ADDRESS).call())

        time.sleep(40)

        crowdfund_class.repayIncremental(220, project_id, COIN_ADDRESS)

        time.sleep(40)

        crowdfund_class.repayInvestments(project_id, [CONTRACT_OWNER_ADDRESS], COIN_ADDRESS)

        time.sleep(40)

        crowdfund_class.collectFees(project_id)

        time.sleep(40)

        crowdfund_class.withdrawBalance(COIN_ADDRESS)
        print(coin_contract.contract_instance.functions.balanceOf(CONTRACT_OWNER_ADDRESS).call())
