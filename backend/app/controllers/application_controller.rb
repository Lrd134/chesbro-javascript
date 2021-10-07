class ApplicationController < ActionController::API


  private
    def shouldFail?
      t = Time.now
      t.sec % 3 === 0 ? true : false
    end
end
