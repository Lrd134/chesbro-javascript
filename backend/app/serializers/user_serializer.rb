class UserSerializer 
  include FastJsonapi::ObjectSerializer
  set_type :user
  set_id :user_id
  attributes :name, :highscore
end