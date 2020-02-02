#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract("sicbo")]] sicbo : public eosio::contract {

public:
 
 sicbo(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

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
 void resultdetail(std::string expectedResult, std::string winningResult) {}

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

 typedef eosio::multi_index<"winner"_n, player_details> address_index;

};
