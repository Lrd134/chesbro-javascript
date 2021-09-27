class UsersController < ApplicationController

  def show
    user = User.find_by(name: params[:id])
    render json: UserSerializer.new(user).serialized_json
  end

  def create
    user = User.new(user_params)
    if user.save
      render json: UserSerializer.new(user).serialized_json
    else
      render json: "error"
    end
    
  end

  def edit

  end

  def update
    
  end

  def destroy

  end

  private

  def user_params
    params.require(:user).permit(:name, :highscore)
  end

end
