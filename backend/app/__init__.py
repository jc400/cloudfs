import os
from flask import Flask


def create_app(test_config=None):
    """App factory, sets up Flask app and returns it."""

    app = Flask(__name__, instance_relative_config=True)

    # config
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "db.sqlite"),
    )
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # set up db, auth, api resources
    from . import db, auth, api

    app.cli.add_command(db.init_db_command)
    app.teardown_appcontext(db.close_db)

    app.register_blueprint(auth.bp)
    app.register_blueprint(api.bp)

    import time
    #if not app.testing:
    #    app.before_request(lambda: time.sleep(1.5))

    @app.route("/")
    def hello():
        return "hello world"

    return app
