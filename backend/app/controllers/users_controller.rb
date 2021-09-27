class UsersController < ApplicationController

  def show
    user = User.find_by(name: params[:id])
    byebug
    render json: UserSerializer.new(user).serialized_json
  end

  def new

  end

  def create

  end

  def edit

  end

  def update
    
  end

  def destroy

  end

end
