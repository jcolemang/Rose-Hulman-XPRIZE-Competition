import threading

import database as db
import neural_network_interface as nn

_voice_connection_data = dict()

def self_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid))

def setup_initial_position(sio, rooms_tracker):
    lock = threading.Lock()

    def initial_position_handler(sid):
        with lock:
            rooms_tracker.add_to_singles_room(sid)

            self_emit(sio, sid, 'freeze_start', rooms_tracker)
            self_emit(sio, sid, 'unfreeze_start', rooms_tracker)

    sio.on('setInitialPosition', initial_position_handler)

def setup_updates(sio, rooms_tracker):
    gesture = {}
    model = nn.NeuralNetworkBlocksworldModel({
        'flips': 'flips.h5',
        'colors': 'colors.h5',
        'letters': 'letters.h5'
    })

    def gesture_handler(sid, data):
        gesture[sid] = data

    def user_message_handler(sid, data):
        move = model.generate_move(
            sid,
            gesture[sid],
            data
        )
        gesture[sid] = None

        if not move:
            print("Failed to find the requested block.")
            return

        # Messages to be cleaned up with issue #25
        if move['type'] == 'flip':
            # Transmit id as 'block<id>'
            self_emit(sio, sid, 'update_flip_block',
                      rooms_tracker, 'block' + str(move['block_id']))
        elif move['type'] == 'impossible':
            self_emit(sio, sid, 'indicate_impossible_move',
                      rooms_tracker, move)
        elif move['type'] == 'ambiguous':
            self_emit(sio, sid, 'indicate_ambiguous_move',
                      rooms_tracker, move)
        else:
            # Transmit id as 'block<id>'
            move_data = {
                'top': move['top'],
                'left': move['left'],
                'block_id': 'block' + str(move['block_id'])
            }

            self_emit(sio, sid, 'update_position',
                      rooms_tracker, move_data)
            self_emit(sio, sid, 'update_movement_data',
                      rooms_tracker, move['move_number'])
            # Transmit id as 'block<id>'
            self_emit(sio, sid, 'Update_score',
                      rooms_tracker, move_data)

    sio.on('receive_gesture_data', gesture_handler)
    sio.on('receive_user_message', user_message_handler)

def setup_ending(sio, rooms_tracker, config):
    db_connection = db.connect_to_db(config)

    def end_button_handler(_, data):
        db.store_game(db_connection, data)

    def disconnect_handler(sid):
        room = rooms_tracker.get_room(sid)

        if room in _voice_connection_data:
            _voice_connection_data.pop(room)

    def store_survey_handler(_, data):
        db.store_survey(db_connection, data)

    sio.on('end_button_pressed', end_button_handler)
    sio.on('disconnect', disconnect_handler)
    sio.on('send_survey_data_to_server', store_survey_handler)
