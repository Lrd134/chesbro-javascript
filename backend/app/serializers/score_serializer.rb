class ScoreSerializer
  include FastJsonapi::ObjectSerializer
  attributes :score, :user_id
end
