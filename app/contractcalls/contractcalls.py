# TODO: Break classes up into different files
# TODO: Look into static classes (forces all instances to share same information)
from web3 import Web3
from string import Template
import requests
import time
from decouple import config

LNAT_FREQUENCY = 86400
CURRTIME = int(time.time())
EVENT_WIDTH = 100
INTERVAL_SECONDS = (CURRTIME - (CURRTIME % 86400))
# TODO: change operation of getLnatHeld from days to seconds
INTERVALS = int(INTERVAL_SECONDS / LNAT_FREQUENCY)
# TODO: take this constant, and replace it with a function, no need to rename
MINED_BLOCK_FREQUENCY = 10
PRIVATE_KEY_OWNER = config('PRIVATE_KEY_OWNER')
PRIVATE_KEY_BORROWER = config('PRIVATE_KEY_BORROWER')


class ContractFactory:
    def __init__(self, abi, contract_address, network):
        self._abi = abi
        if network == "mainnet":
            self.web3 = Web3(Web3.WebsocketProvider(
                "wss://mainnet.infura.io/ws/v3/da966af98520486b9cda846d5d354ef9"))
        elif network == "ropsten":
            self.web3 = Web3(Web3.WebsocketProvider(
                "wss://ropsten.infura.io/ws/v3/da966af98520486b9cda846d5d354ef9"))
        elif network == "local":
            self.web3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
        else:
            raise Exception('Inputed network not valid')

        self.contract_address = self.web3.toChecksumAddress(contract_address)

    def createcontractinstance(self):
        self.contract_instance = self.web3.eth.contract(
            address=self.contract_address, abi=self._abi)


class EventListener:
    def __init__(self, abi, contract_address, network):
        self.contract = ContractFactory(abi, contract_address, network)
        self.contract.createcontractinstance()

# TODO: put this into a faster language (GO or C)

    def runThroughEvents(self, event, pastBlock, currentBlock='latest'):
        complete_event_list = []
        nextBlock = EVENT_WIDTH + pastBlock
        if currentBlock == 'latest':
            currentBlock = self.contract.web3.eth.getBlock('latest')['number']
        while pastBlock <= currentBlock:
            event_filter = self.contract.contract_instance.eventFilter(
                event, {'fromBlock': pastBlock, 'toBlock': nextBlock})
            new_events_list = event_filter.get_all_entries()
            complete_event_list += new_events_list
            pastBlock += EVENT_WIDTH
            nextBlock += EVENT_WIDTH
        return complete_event_list

# TODO: In updateEvent, fix currentBlock so it is the last block looked at in runThrough Events to avoid missing any blocks

    def getNewLogs(self, eventName):
        pastBlock = self.getEvent(eventName)[0]['currentBlock']
        newLogs = self.runThroughEvents(eventName, pastBlock)
        if newLogs == []:
            currentBlock = self.contract.web3.eth.getBlock('latest')['number']
        else:
            currentBlock = newLogs[-1]['blockNumber']
        self.updateEvent(eventName, pastBlock, currentBlock)
        return newLogs

    def _request(self, payload, requestUrl):
        if requestUrl == 'local':
            url = 'http://localhost:8080/graphql/'
        else:
            raise Exception(
                "Provided requestUrl not valid, please input 'local' ('production' will be added later)")
        request = requests.post(
            url, json={'query': payload})
        if request.status_code == 200:
            return request.json()
        else:
            raise Exception("Query failed to run by returning code of {}. {}".format(
                request.status_code, payload))

    def newEvent(self, pastBlock, currentBlock, eventName):
        mutation_template = Template("""
            mutation {
                newEventBlock(currentBlock: $_currentBlock, pastBlock: $_pastBlock, eventName: "$_eventName") {
                    eventblock {
                        id
                        currentBlock
                        pastBlock
                        eventName
                    }
                }
            }
        """)
        mutation = mutation_template.substitute(
            _currentBlock=currentBlock, _pastBlock=pastBlock, _eventName=eventName)
        data = self._request(mutation, 'local')
        return data

    def getEvent(self, eventName):
        query_template = Template("""
                {
                    EventBlock (search: "$_eventName") {
                        id
                        eventName
                        pastBlock
                        currentBlock
                    }
                }
            """)
        query = query_template.substitute(_eventName=eventName)
        result = self._request(query, 'local')
        data = result['data']['EventBlock']
        return data

    def updateEvent(self, eventName, pastBlock, givenCurrentBlock="NoGivenValue"):
        if givenCurrentBlock == "NoGivenValue":
            newLogs = self.runThroughEvents(eventName, pastBlock)
            if newLogs == []:
                currentBlock = self.contract.web3.eth.getBlock('latest')['number']
            else:
                currentBlock = self.runThroughEvents(eventName, pastBlock)[-1]['blockNumber']
        else:
            currentBlock = givenCurrentBlock
        mutation_template = Template("""
            mutation {
                updateEventBlock(eventName:"$_eventName", pastBlock: $_pastBlock, currentBlock: $_currentBlock) {
                    eventblock {
                        id
                        pastBlock
                        currentBlock
                        eventName
                    }
                }
            }
        """)
        mutation = mutation_template.substitute(
            _eventName=eventName, _pastBlock=pastBlock, _currentBlock=currentBlock)
        data = self._request(mutation, 'local')
        return data

    def deleteEvent(self, eventName):
        # print("deleteEvent()")
        mutation_template = Template("""
            mutation {
                deleteEventBlock(eventName: "$_eventName") {
                    eventblock{
                        eventName
                        pastBlock
                        currentBlock
                    }
                }
            }
        """)
        mutation = mutation_template.substitute(_eventName=eventName)
        data = self._request(mutation, 'local')
        return data


class LnatSums():
    def __init__(self, abi, contract_address, network):
        self.contract = ContractFactory(abi, contract_address, network)
        self.contract.createcontractinstance()
        self._events = EventListener(abi, contract_address, network)

# TODO: Lnat Convention is to Lnat
# TODO: getLnatCount to getLnatData
# TODO: change day number in Unix time to seconds in Unix time, look at LNATSum model and change that field

    def getLnatCount(self, user):
        # print("getLnatCount()")
        query_template = Template("""
                {
                    LnatSum (search: "$user") {
                        lnatHeld
                        id
                        dayNumber
                        userAddress
                    }
                }
            """)
        query = query_template.substitute(user=user)
        result = self._events._request(query, 'local')
        return result

# TODO: Check consitency with field names and variables across all models (go through all graphql functions)
# TODO: userAddress make CamelCase
# TODO: newLnatCount -> newLnatHolder

    def newLnatCount(self, user, lnat=None):
        # print("newLnatCount()")
        if lnat == None:
            lnat = self.contract.contract_instance.functions.balanceOf(user).call()
        mutation_template = Template("""
            mutation {
                newLnatCount(dayNumber: $day, lnatHeld: "$lnat", userAddress: "$useraddress") {
                    Lnat {
                        id
                        lnatHeld
                        dayNumber
                        userAddress
                    }
                }
            }
        """)
        mutation = mutation_template.substitute(day=INTERVALS, lnat=lnat, useraddress=user)
        result = self._events._request(mutation, 'local')
        return result

# TODO: Scale the balance of a user by a desired interval amount
# TODO: updateLnatCount -> updateLnatSum (be consistent)

    def updateLnatCount(self, user):
        # print("updateLnatCount()")
        lnat = self.contract.contract_instance.functions.balanceOf(user).call()
        lnat += float(self.getLnatCount(user)['data']['LnatSum'][0]['lnatHeld'])
        mutation_template = Template("""
            mutation {
                updateLnatCount(dayNumber:$day, lnatHeld:"$lnat", userAddress:"$user") {
                    Lnat {
                        id
                        dayNumber
                        lnatHeld
                        userAddress
                    }
                }
            }
        """)
        mutation = mutation_template.substitute(day=INTERVALS, lnat=lnat, user=user)
        result = self._events._request(mutation, 'local')
        return result

    def deleteLnatCount(self, user):
        # print("deleteLnatCount()")
        mutation_template = Template("""
            mutation {
                deleteLnatCount(userAddress: "$user") {
                    Lnat {
                        lnatHeld
                        userAddress
                        dayNumber
                    }
                }
            }
        """)
        mutation = mutation_template.substitute(user=user)
        result = self._events._request(mutation, 'local')
        return result

# TODO: change name OldLnatSum / RequestedLnatSum
# TODO: days (change to seconds) should be the Unix Time for which you want to get the running sum

    def LnatHeld(self, user, days):
        # print("LnatHeld()")
        LnatCount = float(self.getLnatCount(user)['data']['LnatSum'][0]['lnatHeld'])
        return LnatCount - self.LNATDifferenceOverTime(user, days)

# TODO: Fix naming convention for LNAT to Lnat, and lots of other variable names
# TODO: event -> events
# TODO: Combine two parts of the below function so when you're parsing data, you are adding to a running sum for a specified user

    def LNATDifferenceOverTime(self, user, days):
        # print("LnatDifferenceOverTime()")
        eventdict = {}
        currentblock = self.contract.web3.eth.getBlock('latest')['number']
        startBlock = int(currentblock - ((days * LNAT_FREQUENCY) / MINED_BLOCK_FREQUENCY))
        event = self._events.runThroughEvents('Transfer', startBlock)
        for i in event:
            subdict = {}
            blockNum = i['blockNumber']
            eventtime = self.contract.web3.eth.getBlock(blockNum)['timestamp']
            eventuserfrom = i['args']['from']
            eventuserto = i['args']['to']
            eventtoken = i['args']['tokens']
            mideventtime = int((eventtime - (eventtime %
                                             LNAT_FREQUENCY)) / LNAT_FREQUENCY)
            subdict = {'from': eventuserfrom,
                       'to': eventuserto, 'token': eventtoken}
            if mideventtime in eventdict.keys():
                eventdict[mideventtime].append(subdict)
            else:
                eventdict[mideventtime] = [subdict]
        LnatVal = self.contract.contract_instance.functions.balanceOf(user).call()
        runningsum = 0
        day = 0

# TODO: look at getting rid of else

        while day < days:
            if INTERVALS - day in eventdict.keys():
                a = eventdict[INTERVAL_DAYS-day]
                for i in a:
                    if user == i['from']:
                        LnatVal += i['token']
                    elif user == i['to']:
                        LnatVal -= i['token']
                    else:
                        pass
                runningsum += LnatVal
                day += 1
            else:
                runningsum += LnatVal
                day += 1

        return runningsum

# TODO: gas price shouldn't be hardcoded, make it a parameter
# TODO: figure out way to handle gas limit, matters for repayInvestments()
# TODO: LenderCrowdfund -> Crowdfund
# TODO: Make one transaction


class LendgerCrowdfund:
    def __init__(self, abi, contract_address, network):
        self.contract = ContractFactory(abi, contract_address, network)
        self.contract.createcontractinstance()
        self.acct = self.contract.web3.eth.account.privateKeyToAccount(
            PKEY)  # hardcoded  user 0x780255CEa5962854eB50e0e2233De2Cd5CDC2FcD

    def toggleKYC(self, user):
        const_txn = self.contract.contract_instance.functions.toggleKYC(user).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('15', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def KYC(self, user):
        return self.contract.contract_instance.functions.KYC(user).call()

    def changeOracle(self, newOrcale):
        const_txn = self.contract.contract_instance.functions.changeOracle(newOrcale).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('19', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def changeGuarantorInterestRecipient(self, newRecipient):
        const_txn = self.contract.contract_instance.functions.changeGuarantorInterestRecipient(newRecipient).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def createProject(self, idToDelete, packedAttributes, borrower, initialDraw, tiers, stableCoins):
        const_txn = self.contract.contract_instance.functions.createProject(
            idToDelete, packedAttributes, borrower, initialDraw, tiers, stableCoins).buildTransaction({
                'from': self.acct.address,
                'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
                'gas': 1728715,
                'gasPrice': self.contract.web3.toWei('21', 'gwei')
            })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def requestNewAddress(self, idd, requestedAddress):
        const_txn = self.contract.contract_instance.functions.requestNewAddress(idd, requestedAddress).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def voteOnAddress(self, idd, coin, voteYes):
        const_txn = self.contract.contract_instance.functions.voteOnAddress(idd, coin, voteYes).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def acceptBorrowerRole(self, idd):
        const_txn = self.contract.contract_instance.functions.acceptBorrowerRole(idd).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def invest(self, idd, amount, coin):
        const_txn = self.contract.contract_instance.functions.invest(idd, amount, coin).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def requestDraw(self, idd, requestedValue):
        const_txn = self.contract.contract_instance.functions.requestDraw(idd, requestedValue).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def voteOnDraw(self, idd, coin, voteYes):
        const_txn = self.contract.contract_instance.functions.voteOnDraw(idd, coin, voteYes).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def redeemFunding(self, idd):
        account = self.contract.web3.eth.account.privateKeyToAccount(PKEY_BORROWER)
        const_txn = self.contract.contract_instance.functions.redeemFunding(idd).buildTransaction({
            'from': account.address,
            'nonce': self.contract.web3.eth.getTransactionCount(account.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = account.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def repayIncremental(self, amount, idd, coin):
        const_txn = self.contract.contract_instance.functions.repayIncremental(amount, idd, coin).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def repayAll(self, projectId):
        const_txn = self.contract.contract_instance.functions.repayAll(projectId).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def voteToAbort(self, idd, coin):
        const_txn = self.contract.contract_instance.functions.repayInvestments(idd, coin).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def withdrawBalance(self, coin):
        const_txn = self.contract.contract_instance.functions.withdrawBalance(coin).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def redeemInvestment(self, projectId, coin):
        const_txn = self.contract.contract_instance.functions.redeemInvestment(projectId, coin).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def collectFees(self, idd):
        const_txn = self.contract.contract_instance.functions.collectFees(idd).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)

    def repayInvestments(self, projectId, users, coin):
        const_txn = self.contract.contract_instance.functions.repayInvestments(projectId, users, coin).buildTransaction({
            'from': self.acct.address,
            'nonce': self.contract.web3.eth.getTransactionCount(self.acct.address),
            'gas': 1728712,
            'gasPrice': self.contract.web3.toWei('21', 'gwei')
        })

        signed = self.acct.signTransaction(const_txn)
        self.contract.web3.eth.sendRawTransaction(signed.rawTransaction)
