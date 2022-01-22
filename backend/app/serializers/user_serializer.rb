class UserSerializer 
  include FastJsonapi::ObjectSerializer
  set_type :user
  set_id :id
  attributes :name
  has_many :scores, if: Proc.new { |record| record.scores.any? }
end