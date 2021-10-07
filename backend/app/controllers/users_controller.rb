class UsersController < ApplicationController

  def index
    options = {};
    users = User.all
    options[:is_collection] = true;
    if users
      render json: serialize_user(users, options)
    else
      render json: {
        message: "Error: Error Occured when Loading the Users."
      }
    end
  end

  def create
    user = User.find_or_create_by(user_params) unless shouldFail?
    if user
      render json: serialize_user(user)
    else
      render json: {
        message: "Error: Error Occured when Logging in."
      }.to_json
    end
    
  end

  def update
    user = User.find_by(id: params[:id])
    unless shouldFail?
      if user.update(user_params)
        render json: serialize_user(user)
      else
        render json: { 
          message: "Error: Error Occured when Saving."
        }.to_json
      end
    end
  end

  def destroy
    user = User.find_by(id: params[:id])
    
    user.destroy unless shouldFail?
    
    
    if user.destroyed?
      render json: {
        message: "Destroyed successfully."
      }.to_json
    else
      render json: {
        message: "Error: Error Occured when Deleting"
      }.to_json
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :id)
  end

  def serialize_user(user, options = nil)
    if options
      UserSerializer.new(user, options).serialized_json
    else
      UserSerializer.new(user).serialized_json
    end
  end

end