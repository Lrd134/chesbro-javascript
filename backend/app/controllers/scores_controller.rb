class ScoresController < ApplicationController
  def create
    user = User.find_by(name: params[:user_id])
    score = Score.create(score: params[:score], user: user)
    if score.id
      render json: serialize_score(score)
    else
      render json: {
        message: "Failed to save score."
      }.to_json
    end
  end

  def index
    options = {};
    scores = Score.all
    options[:is_collection] = true 
    render json: serialize_score(scores, options)
  end

  private

    def serialize_score(score, options = nil)
      if options
        ScoreSerializer.new(score, options).serialized_json
      else
        ScoreSerializer.new(score).serialized_json
      end
    end
end
