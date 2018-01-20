import socketio
import threading

class RoomsTracker:
    def __init__(self, sio_app):
        self.sio_app = sio_app
        self.recent_room = None
        self.next_room = 0
        self.room_map = {}
        self.roommate_map = {}
        self.lock = threading.Lock()

    def get_room(self, sid):
        if sid not in self.room_map:
            return None

        return self.room_map[sid]

    def get_roommate(self, sid):
        room_name = self.get_room(sid)
        if room_name == None or room_name not in self.roommate_map:
            return None

        roommate_list = list(self.roommate_map[room_name])
        if sid in roommate_list:
            roommate_list.remove(sid)

        if len(roommate_list) is 0:
            return None
        if len(roommate_list) > 1:
            raise "Found > 1 roommates for room " + room_name + ": " + self.roommate_map[room_name]

        return roommate_list[0]

    def add_to_room(self, sid):
        created_room = None
        with self.lock:
            if self.recent_room == None:
                self._add_to_new_room(sid)
                created_room = True
            else:
                self._add_to_recent_room(sid)
                created_room = False
        return created_room

    def _add_to_new_room(self, sid):
        room_name = self._make_room_name(self.next_room)
        self._enter_room(sid, room_name)
        self.recent_room = self.next_room
        self.next_room += 1

    def _add_to_recent_room(self, sid):
        room_name = self._make_room_name(self.recent_room)
        self._enter_room(sid, room_name)
        self.recent_room = None

    def _enter_room(self, sid, room_name):
        self.sio_app.enter_room(sid, room_name)
        self.room_map[sid] = room_name

        roommates = self.roommate_map.setdefault(room_name, [])
        roommates += [sid]

    @staticmethod
    def _make_room_name(room_num):
        return "Room" + str(room_num)