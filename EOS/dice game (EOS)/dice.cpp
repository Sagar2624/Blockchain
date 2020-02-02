#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract("dice")]] dice : public eosio::contract {

public:
 
 dice(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

 [[eosio::action]]
 void betdetails(name user, std::string winnerName, std::string transactionId, std::string winnerAddress, uint64_t winnerAmount, std::string timestamp) {
    require_auth( user );
   address_index addresses( get_self(), get_first_receiver().value );
   auto iterator = addresses.find(user.value);
   if( iterator == addresses.end() )
   {
     addresses.emplace(user, [&]( auto& row ) {
      row.key = user;
      row.winnerName = winnerName;
      row.transactionId = transactionId;
      row.winnerAddress = winnerAddress;
      row.winnerAmount = winnerAmount;
      row.timestamp = timestamp;
     });
   }
   else {
     addresses.modify(iterator, user, [&]( auto& row ) {
      row.key = user;
      row.winnerName = winnerName;
      row.transactionId = transactionId;
      row.winnerAddress = winnerAddress;
      row.winnerAmount = winnerAmount;
      row.timestamp = timestamp;
     });
   }
 }

 [[eosio::action]]
 void allbet(name user, std::string timeRecord, std::string bettor, std::string rollUnder, std::string bet, std::string roll, std::string payout) {
   require_auth( user );
   bets_index addresses( get_self(), get_first_receiver().value );
   auto iterator = addresses.find(user.value);
   if( iterator == addresses.end() )
   {
     addresses.emplace(user, [&]( auto& row ) {
      row.key = user;
      row.timeRecord = timeRecord;
      row.bettor = bettor;
      row.rollUnder = rollUnder;
      row.bet = bet;
      row.roll = roll;
      row.payout = payout;
     });
   }
   else {
     addresses.modify(iterator, user, [&]( auto& row ) {
      row.key = user;
      row.timeRecord = timeRecord;
      row.bettor = bettor;
      row.rollUnder = rollUnder;
      row.bet = bet;
      row.roll = roll;
      row.payout = payout;
     });
   }
   
 }
 
 [[eosio::action]]
 void erase(name user) {
   require_auth(user);

   address_index addresses( get_self(), get_first_receiver().value);

   auto iterator = addresses.find(user.value);
   check(iterator != addresses.end(), "Record does not exist");
   addresses.erase(iterator);
 }
 
 
private:

 struct [[eosio::table]] player_details {
   name key;
   std::string winnerName;
   std::string transactionId;
   std::string winnerAddress;
   uint64_t winnerAmount; 
   std::string timestamp;
   uint64_t primary_key() const { return key.value; }
 };

 struct [[eosio::table]] bet_details {
   name key;
   std::string timeRecord;
   std::string bettor;
   std::string rollUnder;
   std::string bet;
   std::string roll;
   std::string payout;
   uint64_t primary_key() const { return key.value; }
 };
 typedef eosio::multi_index<"winner"_n, player_details> address_index;
 typedef eosio::multi_index<"bets"_n, bet_details> bets_index;

};
