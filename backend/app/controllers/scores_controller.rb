class ScoresController < ApplicationController
  def create
    user = User.find_by(name: params[:name])
    score = Score.create(score: params[:score], user: user)
    if score.id
      render json: serialize_score(score)
    else
      render json: {
        message: "Failed to save score."
      }.to_json
    end
  end

  private

    def serialize_score(score)
      ScoreSerializer.new(score).serialized_json
    end
end
